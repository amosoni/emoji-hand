"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useLoginModal } from "./LoginModalContext";

export default function LoginModal() {
  const { open, close } = useLoginModal();
  const { user } = useUser();

  useEffect(() => {
    if (user && open) {
      close();
    }
  }, [user, open, close]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <SignIn />
      </div>
      <style jsx>{`
        .modal-backdrop {
          position: fixed; left: 0; top: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 9999;
        }
        .modal-content {
          background: #fff; border-radius: 12px; padding: 32px; min-width: 350px;
        }
      `}</style>
    </div>
  );
} 