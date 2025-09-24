"use client";

import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button"


export default function Login() {
  const { isAuthenticated, token, logout } = useAuth();

	if (!isAuthenticated) {   
		console.log("Conta não encontrada");
	} else {
		console.log("O seu token de acesso é " + token);
	}
  
  return (
    <div className="flex min-h-screen bg-background-white">

            <Button className=" rounded-r-xl" variant="outline" onClick={() => logout()}>
              Logout
          </Button>
      </div>
  );
}