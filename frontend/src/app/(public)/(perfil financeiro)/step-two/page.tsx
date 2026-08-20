"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { ArrowRight, ChevronLeftIcon, LockKeyhole, LucidePiggyBank, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Label} from "@/components/ui/label"


export default function StepTwo()
{
	return (
		<main className="flex flex-col items-center justify-center gap-8">
			<Card className="w-200 h-auto p-8 gap-2">
				<CardHeader className="w-full flex gap-4 p-4 items-start justify-between rounded-[8px]  bg-warning/10 border border-warning/30">
					<LockKeyhole className={`text-warning w-4 h-5.25`}/>
					<div>
						<Text as="h6" variant="h6" className="text-foreground text-[16px]">
							Confidencialidade de Dados
						</Text>
						<Text as="p" variant="p" className="text-muted-foreground text-[14px]">
							Suas informações financeiras são criptografadas e utilizadas exclusivamente para
							gerar recomendações personalizadas em conformidade com as leis de proteção
							de dados de Angola.
						</Text>
					</div>
					
				</CardHeader>

				<CardContent className="flex flex-col pt-6 gap-8">
					
					<section className="flex justify-between gap-6">
						<div className="w-full flex flex-col gap-2">
							<Label
							htmlFor="email"
							className="block font-medium text-muted-foreground"
							>
								Rendimento Mensal (kz)
							</Label>
							<div className="w-full relative h-auto">
								<Input
								type="number"
								placeholder="0,00"
								className={`w-full h-13 py-3.5 pl-11 rounded-lg border border-border
											bg-card focus:outline-none focus:ring-primary
											focus:border-primary font-medium transition-all`}
							/>
							<span className={`absolute right-md left-4 top-1/2 -translate-y-1/2 
										 w-4 h-6`}>Kz</span>
							</div>
						</div>
						<div className="w-full flex flex-col gap-2">
							<Label
							htmlFor="email"
							className="block font-medium text-muted-foreground"
							>
								Despesas Mensais (kz)
							</Label>
							<div className="w-full relative h-auto">
								<Input
								type="number"
								placeholder="0,00"
								className={`w-full h-13 py-3.5 pl-11 rounded-lg border border-border
											bg-card focus:outline-none focus:ring-primary
											focus:border-primary font-medium transition-all`}
							/>
							<span className={`absolute right-md left-4 top-1/2 -translate-y-1/2 
										 w-4 h-6`}>Kz</span>
							</div>
						</div>
					</section>
							
					<section className="flex p-6 rounded-[12px] bg-primary/10 border border-primary/20 justify-between items-center ">
						<div className="flex gap-4 items-center">
							<span className=" w-12 h-12 flex items-center justify-center rounded-full bg-primary/15">
								<LucidePiggyBank size="20px" className="text-primary"/>
							</span>
							<div className="block">
								<Text as="span" className="text-muted-foreground">Capacidade de endividamento estimada</Text>
								<Text as="h3" className="text-foreground ">--- Kz</Text>
							</div>
							
							
						</div>

						<AlertCircle size="20px" className="text-primary"/>

					</section>

					<section>
						<div className="w-full flex flex-col gap-2">
							<Label
							htmlFor="email"
							className="flex font-medium text-muted-foreground"
							>
								Score de Credito (opcional)
								<AlertCircle size="15px" className="text-muted-foreground/60" />
							</Label>
							<div className="max-w-60 relative h-auto">
								<Input
								type="number"
								placeholder="Ex: 650"
								className={`w-full h-13 py-3.5 pl-6 rounded-lg border border-border
											bg-card focus:outline-none focus:ring-primary
											focus:border-primary font-medium transition-all`}
							/>
							</div>
						</div>
					</section>

					<section className="w-full not-[]:flex border-t border-border">
						<div className="flex justify-between mt-8 ">
								<Button variant={"link"}
										type="submit"
										className={`w-43.75 h-14 fon-bold
													flex items-center justify-center gap-2 transition-all
													active:scale-[0.98] cursor-pointer`}
								>
										<ChevronLeftIcon className="w-4.5 h-4.5" />
										Voltar
										
								</Button>

								<Button variant={"default"}
										type="submit"
										className={`w-43.75 h-14 fon-bold shadow-md hover:opacity-90
													flex items-center justify-center gap-2 transition-all
													active:scale-[0.98] cursor-pointer`}
								>
										Continuar
										<ArrowRight className="w-4.5 h-4.5" />
								</Button>	
						</div>
					</section>
				</CardContent>
			</Card>
		</main>
	)
}