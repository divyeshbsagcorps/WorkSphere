import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    const res = await authApi.resetPassword(email);
    setMessage(res.message);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 m-0">Reset Your Password</h2>
          <p className="text-xs text-slate-500 mt-1 m-0">
            Enter your employee email address to receive password reset instructions.
          </p>
        </div>

        {message ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-900 m-0">Request Sent</p>
            <p className="text-xs text-slate-600 mt-1 m-0">{message}</p>
            <Link to="/login" className="inline-block mt-4 text-xs font-semibold text-indigo-600 hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              placeholder="alex.rivera@worksphere.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
              Send Reset Instructions
            </Button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center text-xs text-slate-500 hover:text-slate-900 space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
