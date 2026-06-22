"use client"

import { useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Text from "@/components/ui/text";
import RadioOption from "@/components/ui/radio-option";
import { BriefcaseBusiness, Monitor, Building2, GraduationCap, ArrowRight, ChevronLeftIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem,  } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function StepOne()
{
	const [selectedOption, setSelectedOption] = useState<string>("");

	const handleSelect = (value: string) => {
		setSelectedOption(value);
		console.log("Opção selecionada:", value);
		// Aqui você pode enviar os dados para um serviço ou guardar no estado global
	};

	const [checkSwitch, setCheckSwitch] = useState(false)
	const [dependentValue, setDependentValue]  = useState(0)
	const handleSwitch = (state : boolean) => {
		const result = setCheckSwitch(!state)
		console.log(result)
	}
	return (
		<main className="flex flex-col items-center justify-center gap-8">
			<Card className="w-200 h-auto p-8 gap-2">
				<CardHeader>
					<Text as="h1" variant="h1">
						Conte-nos sobre Si
					</Text>
					<Text as="p" variant="p">
						Para criarmos recomendações personalizadas, precisamos entender o seu contexto actual.
					</Text>
				</CardHeader>

				<CardContent className="flex flex-col pt-6 gap-8">
					<section className="flex flex-col gap-4">
						<Text as="p" variant="p" className="uppercase text-primary font-[14px] ">SITUACAO PROFISSIONAL</Text>
						<div className="w-full grid grid-cols-1 md:grid-cols-2 justify-between gap-4">
							<RadioOption
								icon={BriefcaseBusiness}
								title="Empregado"
								description="Contrato por conta de outrem"
								value="empregado"
								checked={selectedOption === "empregado"}
								onChange={handleSelect}
							/>
							<RadioOption
								icon={Monitor}
								title="Autónomo"
								description="Trabalhador independente"
								value="autonomo"
								checked={selectedOption === "autonomo"}
								onChange={handleSelect}
							/>
							<RadioOption
								icon={Building2}
								title="Empresário"
								description="Proprietário de negócio"
								value="empresario"
								checked={selectedOption === "empresario"}
								onChange={handleSelect}
							/>
							<RadioOption
								icon={GraduationCap}
								title="Estudante / Outros"
								description="Ainda não no mercado"
								value="estudante"
								checked={selectedOption === "estudante"}
								onChange={handleSelect}
							/>
						</div>
					</section>

					<section className="flex flex-col gap-4 ">
						<Text className="uppercase text-primary text-[14px]">Nivel Escolaridade</Text>
						<ToggleGroup
							className="flex gap-2"
							type="single"
							spacing={4}
							size={"lg"}
						>
							<ToggleGroupItem
								value="E-M" 
								className={`py-4 px-2 rounded-full border border-[#C4C6D0] transition-colors hover:border-[#F0F3FF] 
											hover:bg-[#F0F3FF] data-[state=on]:bg-primary data-[state=on]:border-primary data-[state=on]:text-white`} 
								>
									Ensino Medio
							</ToggleGroupItem>

							<ToggleGroupItem
								value="L"
								className={`py-4 px-2 rounded-full border border-[#C4C6D0] transition-colors hover:border-[#F0F3FF] 
											hover:bg-[#F0F3FF] data-[state=on]:bg-primary data-[state=on]:border-primary data-[state=on]:text-white`}
								>
									Licenciatura
							</ToggleGroupItem>

							<ToggleGroupItem
								value="M-D"
								className={`py-4 px-2 rounded-full border border-[#C4C6D0] transition-colors hover:border-[#F0F3FF] 
											hover:bg-[#F0F3FF] data-[state=on]:bg-primary data-[state=on]:border-primary data-[state=on]:text-white`}
								>
									Mestrado/Doutoramento
							</ToggleGroupItem>
						</ToggleGroup>
					</section>

					<section className="flex justify-between">
						<div className="flex flex-col gap-2">
							<Text as="span" variant="span" className="font-medium text-[14px] text-primary" >Numero de dependentes</Text>
							<div className="flex justify-between items-center gap-4 max-w-50 h-auto p-1 rounded-2xl bg-[#f0f3ff] border-[#c4c6c0]">
								<Button
									className="cursor-pointer w-10 h-10 bg-[#f9f9ff] text-[#00163c] text-[18px] font-bold"
									onClick={()=> setDependentValue((prevalue)=> prevalue + 1 )}
								>
									+
								</Button>

								<Input
									className="border-none hover:border-none text-center text-[14px] font-bold focus:border-none"
									type="number"
									value={dependentValue}

								/>
								<Button
								onClick={()=> setDependentValue((prevalue)=> prevalue - 1 <= 0? 0 : prevalue - 1)}
									className="cursor-pointer w-10 h-10 bg-[#f9f9ff] text-[#00163c] text-[18px] font-bold"
								>
									-
								</Button>
							</div>
						</div>
						<div className="w-80 h-auto flex flex-col gap-4">
							<div  className="cursor-pointer w-full flex justify-between items-center">
								<label className="cursor-pointer w-full h-auto" onClick={()=> setCheckSwitch((prevalue)=> prevalue == false ? true : false)}>
									<Text as="h6" variant="h6" className="text-[16px]">Conta bancaia</Text>
									<Text as="span" variant="span" className="text-[14px]" >Possui uma conta bancaria?</Text>
								</label>
								<Switch size="default" checked={checkSwitch} onClick={()=> setCheckSwitch((prevalue)=> prevalue == false ? true : false)} className="cursor-pointer"/>
							</div>

							<div  className="cursor-pointer w-full flex justify-between items-center">
								<label className="cursor-pointer w-full h-auto" onClick={()=> setCheckSwitch((prevalue)=> prevalue == false ? true : false)}>
									<Text as="h6" variant="h6" className="text-[16px]">Historico de Credito</Text>
									<Text as="span" variant="span" className="text-[14px]" >Ja solicitou emprestimos antes??</Text>
								</label>
								<Switch size="default" checked={checkSwitch} onClick={()=> setCheckSwitch((prevalue)=> prevalue == false ? true : false)} className="cursor-pointer"/>
							</div>
							
						</div>
					</section>


					<section className="w-full not-[]:flex border-t border-[#4445]">
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