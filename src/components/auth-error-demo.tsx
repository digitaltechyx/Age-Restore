"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAuthErrorMessage } from "@/lib/authErrors";

// Mock Firebase errors for demonstration
const mockFirebaseErrors = [
  { code: 'auth/user-not-found', message: 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).' },
  { code: 'auth/wrong-password', message: 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).' },
  { code: 'auth/invalid-email', message: 'Firebase: The email address is badly formatted. (auth/invalid-email).' },
  { code: 'auth/email-already-in-use', message: 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).' },
  { code: 'auth/weak-password', message: 'Firebase: The password provided is too weak. (auth/weak-password).' },
  { code: 'auth/too-many-requests', message: 'Firebase: We have blocked all requests from this device due to unusual activity. Try again later. (auth/too-many-requests).' },
  { code: 'auth/network-request-failed', message: 'Firebase: A network error (such as timeout, interrupted connection or unreachable host) has occurred. (auth/network-request-failed).' },
  { code: 'auth/invalid-credential', message: 'Firebase: The supplied auth credential is malformed or has expired. (auth/invalid-credential).' },
];

export function AuthErrorDemo() {
  const [selectedError, setSelectedError] = useState<any>(null);
  const [customError, setCustomError] = useState('');

  const handleErrorSelect = (error: any) => {
    setSelectedError(error);
  };

  const handleCustomError = () => {
    if (customError.trim()) {
      setSelectedError({ message: customError });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Authentication Error Message Demo</CardTitle>
          <CardDescription>
            See how Firebase errors are converted to user-friendly messages. 
            Select a mock error below to see the transformation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mock Firebase Errors */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Mock Firebase Errors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockFirebaseErrors.map((error, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleErrorSelect(error)}
                  className="h-auto p-3 text-left justify-start"
                >
                  <div>
                    <div className="font-medium text-sm">{error.code}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {error.message.substring(0, 60)}...
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Error Input */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Test Custom Error</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter a custom error message..."
                value={customError}
                onChange={(e) => setCustomError(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleCustomError} disabled={!customError.trim()}>
                Test Error
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {selectedError && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Error Transformation</h3>
              
              {/* Original Firebase Error */}
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium text-red-800">Original Firebase Error:</div>
                    <div className="text-sm text-red-700 font-mono bg-red-100 p-2 rounded">
                      {selectedError.code && <div>Code: {selectedError.code}</div>}
                      <div>Message: {selectedError.message}</div>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* User-Friendly Error */}
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium text-green-800">User-Friendly Message:</div>
                    <div className="text-sm text-green-700 bg-green-100 p-2 rounded">
                      {getAuthErrorMessage(selectedError)}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Firebase returns technical error codes and messages</li>
              <li>• Our error handler converts them to user-friendly messages</li>
              <li>• Users see clear, actionable error messages instead of technical jargon</li>
              <li>• Common errors like "user-not-found" become "Invalid email or password"</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

