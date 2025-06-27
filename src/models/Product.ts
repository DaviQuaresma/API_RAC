export interface Product {
  descricao: string;
  codigoProprio?: string;
  codCategoria: number;
  estoque: number;
  estoqueMinimo: number;
  controlarEstoque: boolean;
  margemLucro: number;
  precoCusto: number;
  precoVenda: number;
  origemFiscal: number;
  unidadeTributada: string;
  refEanGtin?: string;
  ncm?: string;
  codigoCEST?: string;
  excecaoIPI: number;
  codigoGrupoTributos: number;
  anotacoesNFE?: string;
  anotacoesInternas?: string;
  pesoBruto: number;
  pesoLiquido: number;
  tags?: string[];
}
