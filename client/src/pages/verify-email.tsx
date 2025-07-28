import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "wouter";

export default function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/login">
            <Button variant="ghost" className="mb-4 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Button>
          </Link>
          
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
            <Mail className="text-white w-8 h-8" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
          <p className="text-gray-600 text-sm mb-2">
            We've sent a 6-digit code to <br />
            <span className="font-medium">user@example.com</span>
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter the verification code sent to your email
                </label>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="rounded-xl border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl py-3 font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                disabled={verificationCode.length !== 6}
              >
                Verify email
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600">Didn't receive the code? </span>
                <Button variant="link" className="text-purple-600 hover:text-purple-700 font-medium p-0 h-auto">
                  Resend
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}