"use client";

import AuthHeader from "@/components/auth/AuthHeader";
import Text from "@/components/ui/text";
import { Card, CardContent  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Mail,LockKeyhole, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/lib/schemas/auth.schema";

export default function LoginPage() {
	const {
			register,
			handleSubmit,
			formState: {errors}
		} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema)
	});

	function onSubmit(data: LoginFormValues)
	{
		console.log("submit", data)
	}

  return (
	  <main className=" flex flex-col items-center justify-center gap-8">
		<AuthHeader
		  title="Seja bem-vindo(a) a melhor"
		  description="Plataforma de Recomendações Financeiras"
		/>
		<Card className="max-w-100 flex flex-col justify-center items-center p-8  w-full h-auto bg-card rounded-b-lg">
			<Text as="p" className="text-center">
				Faça login para acessar suas recomendações personalizadas
			</Text>
			<CardContent className="w-full flex flex-col gap-4 p-0">
				<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-6">
				<div className="w-full flex flex-col gap-2">
					<Label
					htmlFor="email"
					className="block font-medium text-[#44474f]"
					>
						E-mail institucional
					</Label>
					<div className="w-full relative h-auto">
						<Input
						id="email"
						type="email"
						placeholder="nome@example.com"
						className={`w-full h-13 py-3.5 pl-11 rounded-lg border border-[#c4c6d0]
									bg-[#f9f9ff] focus:outline-none focus:ring-primary
									focus:border-primary font-medium transition-all`}
						{...register("email")}
					/>
						<Mail className={`absolute right-md left-1.5 top-1/2 -translate-y-1/2 
										text-[#c4c6d0] w-4.5 h-4.5`}/>
					</div>
					{errors?.email && (
						<div className="text-red-500 text-xs">
							{errors?.email.message}
						</div>
					)}
				</div>

				<div className="w-full flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<Label
						htmlFor="password"
						className="block font-medium text-[#44474f]"
						>
							Password
						</Label>
						<a 
							href="#"
							className={`text-primary hover:underline hover:text-[#835500]
										font-medium transition-all cursor-pointer`}
          				>
            				Esqueceu a password?
          				</a>
					</div>
					<div className="w-full relative h-auto">
						<Input
						id="password"
						type="password"
						placeholder="••••••••"
						className={`w-full h-13 py-3.5 pl-11 rounded-lg border border-[#c4c6d0]
									bg-[#f9f9ff] focus:outline-none focus:ring-primary
									focus:border-primary font-medium transition-all`}
						{...register("password")}
					/>
						<LockKeyhole className={`absolute left-1.5 top-1/2 -translate-y-1/2
										text-[#c4c6d0] w-4 h-4.5`}/>
						<button
							type="button"
							className="cursor-pointer"
						>
								<Eye className={`absolute right-2 top-1/2 -translate-y-1/2
										text-[#c4c6d0] w-4.5 h-4.5`} />
						</button>
						
					</div>
					{errors?.password && (
						<div className="text-red-500 text-xs">
							{errors?.password.message}
						</div>
					)}
				</div>

				<Button variant={"default"}
						type="submit"
						className={`w-full h-14 fon-bold shadow-md hover:opacity-90
									flex items-center justify-center gap-2 transition-all
									active:scale-[0.98] cursor-pointer`}
				>
							Entrar
							<ArrowRight className="w-4.5 h-4.5" />
				</Button>

				 {/* Divider */}
				<div className="flex items-center gap-3 py-3">
					<div className="grow h-0.5 bg-[#4445]" />

					<span className="font-label-md text-label-md text-outline">
						ou
					</span>

					<div className="grow h-0.5 bg-[#4445]" />
				</div>

				{/* Register */}
				<div className="text-center">
					<Text as="span" className="mr-2 text-[#44474f]">
					Ainda não tem conta?
					</Text>

					<a
					href="register"
					className={`font-label-md text-label-md text-[#835500] hover:text-primary font-bold hover:underline`}
					>
					Registar-se
					</a>
				</div>
				</form>
			</CardContent>
			<div className="bg-neutral-50/0 border-t-0.5 p-0 border-t-[#4445] flex gap-1">
	
				
					<Text as="span" className="text-[14px] text-[#747780]">
						Os seus dados estão sendo protegidos e armazenados com segurança segundo a lei 14AF da 
						legislação da constituição penal e proteção de dados.
					</Text>

		  	
		  </div>
		</Card>
	  </main>

  );
}