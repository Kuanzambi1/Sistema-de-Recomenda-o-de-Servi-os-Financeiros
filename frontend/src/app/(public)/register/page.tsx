"use client";

import AuthHeader from "@/components/auth/AuthHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Text from "@/components/ui/text";
import { RegisterFormValues, registerSchema } from "@/lib/schemas/auth.schema";
import {zodResolver} from "@hookform/resolvers/zod";
import { ArrowRight, Eye, LockKeyhole, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";


export default function RegisterPage(){

  	const {
			register,
			handleSubmit,
			formState: {errors}
		} = useForm<RegisterFormValues>({
			resolver: zodResolver(registerSchema)
		});

	function onSubmit(data: RegisterFormValues)
	{
		console.log("submit", data)
	}

   return (
	  <main className=" flex flex-col items-center justify-center gap-8">
		<AuthHeader
		  title="Crie sua Conta"
		  description="Plataforma de Recomendações Financeiras"
		/>
		<Card className="max-w-100 flex flex-col justify-center items-center p-8  w-full h-auto bg-card rounded-b-lg">
			<CardContent className="w-full flex flex-col gap-4 p-0">
				<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-6">
				<div className="w-full flex flex-col gap-2">
					<Label
					htmlFor="email"
					className="block font-medium text-[#44474f]"
					>
						Nome Completo
					</Label>
					<div className="w-full relative h-auto">
						<Input
						id="nome"
						type="text"
						placeholder="Emanuel Kwanzambi"
						className={`w-full h-13 py-3.5 pl-11 rounded-lg border border-[#c4c6d0]
									bg-[#f9f9ff] focus:outline-none focus:ring-primary
									focus:border-primary font-medium transition-all`}
						{...register("nome")}
					/>
						<User className={`absolute right-md left-2 top-1/2 -translate-y-1/2 
										text-[#c4c6d0] w-4.5 h-4.5`}/>
					</div>
					{errors?.nome && (
						<div className="text-red-500 text-xs">
							{errors?.nome.message}
						</div>
					)}
				</div>

				<div className="w-full flex flex-col gap-2">
					<Label
					htmlFor="email"
					className="block font-medium text-[#44474f]"
					>
						Email
					</Label>
					<div className="w-full relative h-auto">
						<Input
						id="email"
						type="email"
						placeholder="example@mail.com"
						className={`w-full h-13 py-3.5 pl-11 rounded-lg border border-[#c4c6d0]
									bg-[#f9f9ff] focus:outline-none focus:ring-primary
									focus:border-primary font-medium transition-all`}
						{...register("email")}
					/>
						<Mail className={`absolute right-md left-2 top-1/2 -translate-y-1/2 
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
						<LockKeyhole className={`absolute left-2 top-1/2 -translate-y-1/2
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

				<div className="w-full flex flex-col gap-2">
					<div className="flex justify-between items-center">
						<Label
						htmlFor="password"
						className="block font-medium text-[#44474f]"
						>
							Confirmar Password
						</Label>
					</div>
					<div className="w-full relative h-auto">
						<Input
						id="confirmPassword"
						type="password"
						placeholder="••••••••"
						className={`w-full h-13 py-3.5 pl-11 rounded-lg border border-[#c4c6d0]
									bg-[#f9f9ff] focus:outline-none focus:ring-primary
									focus:border-primary font-medium transition-all`}
						{...register("confirmPassword")}
					/>
						<LockKeyhole className={`absolute left-2 top-1/2 -translate-y-1/2
										text-[#c4c6d0] w-4 h-4.5`}/>
						<button
							type="button"
							className="cursor-pointer"
						>
								<Eye className={`absolute right-2 top-1/2 -translate-y-1/2
										text-[#c4c6d0] w-4.5 h-4.5`} />
						</button>
						
					</div>
					{errors?.confirmPassword && (
						<div className="text-red-500 text-xs">
							{errors?.confirmPassword.message}
						</div>
					)}
				</div>
				
				<div className="w-full flex items-start gap-6">
					<Checkbox className="w-5 h-5 p-0 m-0 "/>
					<Text as="span" className="text-[14px] space-x-0 space-y-0">
						Eu aceito os 
						<a href="#" className="text-[#835500] font-medium"> Termos de Serviço </a>
						e a
						 <a href="#" className="text-[#835500] font-bold"> Política de Privacidade</a> do SRF. 
					</Text>
				</div>

				<Button variant={"default"}
						type="submit"
						className={`w-full h-14 fon-bold shadow-md hover:opacity-90
									flex items-center justify-center gap-2 transition-all
									active:scale-[0.98] cursor-pointer`}
				>
							Criar Conta
							<ArrowRight className="w-4.5 h-4.5" />
				</Button>

				
				</form>
			</CardContent>
		</Card>
		{/* Register */}
			<div className="text-center">
				<Text as="span" className="mr-2 text-[#44474f]">
					Ja tem conta?
				</Text>

				<a
					href="login"
					className={`font-label-md text-label-md text-primary hover:text-[#835500] font-bold hover:underline`}
				>
					Entrar
				</a>
			</div>
	  </main>

  );
} 