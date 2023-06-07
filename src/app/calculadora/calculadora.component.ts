import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, Validators} from "@angular/forms";
// @ts-ignore
import faixasEtariasJSON from "../../assets/formula.json";

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent {
  grauDependencia = [
    {
      nome: 'Cônjuge e companheiro(a)',
      value: 'Cônjuge e companheiro(a)'
    },
    {
      nome: 'Dependente sob condição de invalidez',
      value: 'Dependente sob condição de invalidez',
    },
    {
      nome: 'Enteado(a)',
      value: 'Enteado(a)',
    },
    {
      nome: 'Filho(a)',
      value: 'Filho(a)',
    },
    {
      nome: 'Ex-cônjuge ou Ex-convivente com pensão alimenticia',
      value: 'Ex-cônjuge ou Ex-convivente com pensão alimenticia',
    },
    {
      nome: 'Menor sob guarda',
      value: 'Menor sob guarda',
    },
    {
      nome: 'Tutelado(a)',
      value: 'Tutelado(a)'
    },
  ]
  salario: string = '';
  idade: any = '';
  resultado: string = '';
  submitForm: any;
  faixaIdade: string | undefined

  constructor(private formBuilder: FormBuilder) {
    this.submitForm = this.formBuilder.group({
      salarioContribuicao: [null, Validators.required],
      idade: [null, Validators.required],
      grauDependencia: [''],
      dependenteIdade: [''],
      numeroDependentes: [''],
      dependentes: this.formBuilder.array([])
    });

  }

  adicionarDependentes() {
    const numeroDependentes = this.submitForm.value.numeroDependentes;

    // Limpar dependentes existentes
    this.limparDependentes();

    // Adicionar novos dependentes com base no número digitado
    for (let i = 0; i < numeroDependentes; i++) {
      this.adicionarDependente();
    }
  }

  adicionarDependente() {
    const dependentes = this.submitForm.get('dependentes') as FormArray;

    const dependenteGroup = this.formBuilder.group({
      grauDependencia: [''],
      dependenteIdade: ['']
    });

    dependentes.push(dependenteGroup);
  }

  limparDependentes() {
    const dependentes = this.submitForm.get('dependentes') as FormArray;
    dependentes.clear();
  }

  loadFaixasEtarias() {
    const faixasEtarias: FaixaEtaria[] = faixasEtariasJSON.faixas;
    this.resultado = this.calcularTetoPorcentagem(faixasEtarias).toFixed(2);
  }

  calcularTetoPorcentagem(faixasEtarias: FaixaEtaria[]): number {
    const salario = parseFloat(this.submitForm.value.salarioContribuicao);
    const idade = parseFloat(this.submitForm.value.idade);

    for (let i = 0; i < faixasEtarias.length; i++) {
      const faixa = faixasEtarias[i];

      if (idade >= faixa.idadeMin && idade <= faixa.idadeMax) {
        const valorCalculo = (salario * faixa.porcentagem) / 100;
        this.faixaIdade = ((faixa.idadeMax >= 60 ? "Acima de 59 anos" : faixa.idadeMin + '-' + faixa.idadeMax) )
        this.idade  = idade
        return Math.min(valorCalculo, faixa.teto);
      }
    }

    return 0; // Faixa etária não encontrada
  }

}
interface FaixaEtaria {
  idadeMin: number;
  idadeMax: number;
  teto: number;
  porcentagem: number;
}
