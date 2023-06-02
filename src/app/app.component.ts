import {Component} from '@angular/core';
// @ts-ignore
import faixasEtariasJSON from '../assets/formula.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'calc';
  submitForm: any;
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


  calcularTetoPorcentagem(calculoSalario: number, idade: number, faixas: FaixaEtaria[]): number {
    const faixa = faixas.find((faixaEtaria) => idade >= faixaEtaria.idadeMin && idade <= faixaEtaria.idadeMax);

    if (faixa) {
      const valorCalculo = calculoSalario * (faixa.porcentagem / 100);
      return Math.min(valorCalculo, faixa.teto);
    }

    return 0; // Faixa etária não encontrada
  }



  teste(){

    const faixasEtarias: FaixaEtaria[] = faixasEtariasJSON.faixas;

// Exemplo de uso com valores do formulário
    const calculoSalario: number = 3000;
    const idade: number = 25;
    const resultado: number = this.calcularTetoPorcentagem(calculoSalario, idade, faixasEtarias);
    console.log(resultado); // Exibirá o resultado calculado

  }

}
interface FaixaEtaria {
  idadeMin: number;
  idadeMax: number;
  teto: number;
  porcentagem: number;
}
