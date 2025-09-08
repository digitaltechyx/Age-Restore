"use client";

import Link from "next/link";
import { Eye, FileDown, MoreHorizontal, Download, FileType, Search, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { User } from "@/lib/types";

const statusVariant: { [key in User['status']]: "default" | "secondary" | "destructive" } = {
  approved: "default",
  pending: "secondary",
  disapproved: "destructive",
};

const statusColor: { [key in User['status']]: string } = {
  approved: "bg-green-500",
  pending: "bg-yellow-500",
  disapproved: "bg-red-500",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "registrationDate":
          aValue = new Date(a.registrationDate);
          bValue = new Date(b.registrationDate);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        
        const fetchedUsers: User[] = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() } as User);
        });
        
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const updateUserStatus = async (userId: string, newStatus: User['status']) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Prepare update data
      const updateData: any = { status: newStatus };
      
      // If approving user, set the approval date
      if (newStatus === 'approved') {
        updateData.approvedAt = new Date().toISOString();
      }
      
      await updateDoc(userRef, updateData);
      
      // Find the user to get their details for email
      const user = users.find(u => u.id === userId);
      
      setUsers(users.map(user => 
        user.id === userId ? { 
          ...user, 
          status: newStatus,
          approvedAt: newStatus === 'approved' ? new Date().toISOString() : user.approvedAt
        } : user
      ));
      
      toast({
        title: "Status Updated",
        description: `User status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("name");
    setSortOrder("asc");
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all" || sortBy !== "name" || sortOrder !== "asc";

  const downloadAllUsersData = async (format: 'csv' | 'json' | 'word') => {
    toast({
      title: "Preparing Download",
      description: `Generating ${format.toUpperCase()} file with all users data...`,
    });

    try {
      // Fetch all images for all users
      const imagesRef = collection(db, 'images');
      const imagesSnapshot = await getDocs(imagesRef);
      
      const imagesByUser: { [userId: string]: any[] } = {};
      imagesSnapshot.forEach((doc) => {
        const imageData = { id: doc.id, ...doc.data() } as any;
        const userId = (imageData as any).userId;
        if (!imagesByUser[userId]) {
          imagesByUser[userId] = [];
        }
        imagesByUser[userId].push(imageData);
      });

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        const allUsersData = {
          "🏢 SYSTEM_OVERVIEW": {
            "Export_Date": new Date().toLocaleDateString() + " at " + new Date().toLocaleTimeString(),
            "Exported_By": "Admin Dashboard",
            "Report_Type": "Complete System Export",
            "Total_Users": users.length,
            "Total_Photos": Object.values(imagesByUser).flat().length,
            "File_Format": "JSON"
          },
          "👥 ALL_USERS": users.map((user, index) => ({
            "User_Number": index + 1,
            "Profile": {
              "User_ID": user.id,
              "Full_Name": user.name,
              "Email_Address": user.email,
              "Account_Status": user.status.toUpperCase(),
              "Registration_Date": user.registrationDate,
              "Photo_Count": imagesByUser[user.id]?.length || 0
            },
            "Photo_Gallery": (imagesByUser[user.id] || []).map((img, imgIndex) => ({
              "Photo_Number": imgIndex + 1,
              "Image_ID": img.id,
              "Original_File_Name": img.fileName,
              "Upload_Date": img.uploadDate,
              "Download_Link": img.imageUrl
            }))
          })),
          "📊 STATISTICS": {
            "Users_by_Status": {
              "Approved": users.filter(u => u.status === 'approved').length,
              "Pending": users.filter(u => u.status === 'pending').length,
              "Disapproved": users.filter(u => u.status === 'disapproved').length
            },
            "Photo_Distribution": users.map(user => ({
              "User_Name": user.name,
              "Photo_Count": imagesByUser[user.id]?.length || 0
            }))
          }
        };

        content = JSON.stringify(allUsersData, null, 2);
        filename = `Complete_System_Export_${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else if (format === 'word') {
        // Generate Word document for bulk export
        const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType } = await import('docx');
        
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              // Title
              new Paragraph({
                children: [
                  new TextRun({
                    text: "COMPLETE SYSTEM EXPORT",
                    bold: true,
                    size: 36,
                  }),
                ],
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 400 },
              }),
              
              // Export Info
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Export Date: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
              }),
              
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Exported By: Admin Dashboard",
                    size: 24,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 600 },
              }),

              // System Overview Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "SYSTEM OVERVIEW",
                    bold: true,
                    size: 28,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 400, after: 300 },
              }),

              // Overview Table
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Total Users", bold: true })] })],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: users.length.toString() })] })],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Total Photos", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: Object.values(imagesByUser).flat().length.toString() })] })],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Approved Users", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: users.filter(u => u.status === 'approved').length.toString() })] })],
                      }),
                    ],
                  }),
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Pending Users", bold: true })] })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: users.filter(u => u.status === 'pending').length.toString() })] })],
                      }),
                    ],
                  }),
                ],
              }),

              // All Users Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "ALL USERS SUMMARY",
                    bold: true,
                    size: 28,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 800, after: 300 },
              }),

              // Users Table
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  // Header row
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "User #", bold: true })] })],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Full Name", bold: true })] })],
                        width: { size: 25, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Email", bold: true })] })],
                        width: { size: 30, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })],
                        width: { size: 15, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Photos", bold: true })] })],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: "Reg. Date", bold: true })] })],
                        width: { size: 10, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
                  // Data rows
                  ...users.map((user, index) => 
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: (index + 1).toString() })] })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: user.name })] })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: user.email, size: 18 })] })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: user.status.toUpperCase() })] })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: (imagesByUser[user.id]?.length || 0).toString() })] })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ children: [new TextRun({ text: user.registrationDate, size: 16 })] })],
                        }),
                      ],
                    })
                  ),
                ],
              }),

              // Summary Section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "REPORT SUMMARY",
                    bold: true,
                    size: 28,
                  }),
                ],
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 800, after: 300 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `• Total Users in System: ${users.length}`,
                    size: 22,
                  }),
                ],
                spacing: { after: 150 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `• Total Photos Uploaded: ${Object.values(imagesByUser).flat().length}`,
                    size: 22,
                  }),
                ],
                spacing: { after: 150 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `• Active Users (Approved): ${users.filter(u => u.status === 'approved').length}`,
                    size: 22,
                  }),
                ],
                spacing: { after: 150 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: `• Report Generated: ${new Date().toLocaleDateString()}`,
                    size: 22,
                  }),
                ],
                spacing: { after: 400 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "Note: For detailed photo information of individual users, please generate individual user reports.",
                    size: 20,
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 400 },
              }),
            ],
          }],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Complete_System_Export_${new Date().toISOString().split('T')[0]}.docx`;
        a.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Download Complete!",
          description: `Complete system export generated as Word document.`,
        });
        return;
      } else {
        // Much cleaner CSV format
        let csvContent = '';
        
        // Header with summary
        csvContent += '=======================================================\n';
        csvContent += '              COMPLETE SYSTEM EXPORT\n';
        csvContent += '=======================================================\n';
        csvContent += `Export Date:,${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}\n`;
        csvContent += `Exported By:,Admin Dashboard\n`;
        csvContent += `Report Type:,Complete System Export\n`;
        csvContent += `Total Users:,${users.length}\n`;
        csvContent += `Total Photos:,${Object.values(imagesByUser).flat().length}\n`;
        csvContent += '\n';

        // Statistics section
        csvContent += 'SYSTEM STATISTICS\n';
        csvContent += '-----------------\n';
        csvContent += 'Status,User Count\n';
        csvContent += `Approved Users,${users.filter(u => u.status === 'approved').length}\n`;
        csvContent += `Pending Users,${users.filter(u => u.status === 'pending').length}\n`;
        csvContent += `Disapproved Users,${users.filter(u => u.status === 'disapproved').length}\n`;
        csvContent += '\n\n';

        // All users summary
        csvContent += 'ALL USERS SUMMARY\n';
        csvContent += '-----------------\n';
        csvContent += 'User #,User ID,Full Name,Email Address,Account Status,Registration Date,Photo Count\n';
        
        users.forEach((user, index) => {
          const userImageCount = imagesByUser[user.id]?.length || 0;
          csvContent += `${index + 1},${user.id},${user.name},${user.email},${user.status.toUpperCase()},${user.registrationDate},${userImageCount}\n`;
        });

        csvContent += '\n\n';
        csvContent += 'ALL PHOTOS DATABASE\n';
        csvContent += '-------------------\n';
        csvContent += 'Photo #,Image ID,User ID,User Name,Original File Name,Upload Date,Download Link\n';
        
        let photoCounter = 1;
        Object.entries(imagesByUser).forEach(([userId, userImages]) => {
          const user = users.find(u => u.id === userId);
          userImages.forEach(img => {
            csvContent += `${photoCounter},${img.id},${userId},${user?.name || 'Unknown'},${img.fileName},${img.uploadDate},${img.imageUrl}\n`;
            photoCounter++;
          });
        });

        csvContent += '\n';
        csvContent += '=======================================================\n';
        csvContent += 'SUMMARY REPORT\n';
        csvContent += '--------------\n';
        csvContent += `Total Users in System:,${users.length}\n`;
        csvContent += `Total Photos Uploaded:,${Object.values(imagesByUser).flat().length}\n`;
        csvContent += `Active Users (Approved):,${users.filter(u => u.status === 'approved').length}\n`;
        csvContent += `Report Generated:,${new Date().toLocaleDateString()}\n`;
        csvContent += '=======================================================\n';

        content = csvContent;
        filename = `Complete_System_Export_${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Complete!",
        description: `All users data exported as ${format.toUpperCase()}.`,
      });

    } catch (error) {
      console.error('Error downloading all users data:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate users data file. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">User Management</h1>
          <p className="text-muted-foreground">
            View, approve, and manage all registered users.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadAllUsersData('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Download All (CSV)
          </Button>
          <Button variant="outline" onClick={() => downloadAllUsersData('json')}>
            <Download className="mr-2 h-4 w-4" />
            Download All (JSON)
          </Button>
          <Button variant="outline" onClick={() => downloadAllUsersData('word')}>
            <FileType className="mr-2 h-4 w-4" />
            Download All (Word)
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter and search users by name, email, status, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="disapproved">Disapproved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="registrationDate">Registration Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Order</Label>
              <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending (A-Z)</SelectItem>
                  <SelectItem value="desc">Descending (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Summary and Clear Button */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
              {hasActiveFilters && (
                <span className="ml-2 text-primary">
                  (filtered)
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">
            {hasActiveFilters ? 'Filtered Users' : 'All Users'}
          </CardTitle>
          <CardDescription>
            {hasActiveFilters 
              ? `Showing ${filteredUsers.length} of ${users.length} users based on your filters.`
              : 'A list of all users in the system.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl || "https://placehold.co/40x40.png"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[user.status]} className={`${statusColor[user.status]} text-white hover:${statusColor[user.status]}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.registrationDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/admin/users/${user.id}`}>
                           <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </Link>
                        {user.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'approved')}>
                              Approve User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'disapproved')}>
                              Disapprove User
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem>
                          <FileDown className="mr-2 h-4 w-4" />
                          Download Data
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
