import type { LanguageCode } from '@/config/types';
import { MAX_SAME_SIMULATION_EXCEPTIONS } from '@/lib/proReports';

export interface ScenarioWarningCopy {
  title: string;
  bodyWithCredit: string;
  bodyNoCredit: string;
  exceptionsLabel: string;
  sameSimulation: string;
  useCredit: string;
  buyReport: string;
  revert: string;
  redirecting: string;
  creditRemaining: string;
}

const ES: ScenarioWarningCopy = {
  title: 'Cambio de escenario detectado',
  bodyWithCredit:
    'Has modificado datos clave de la operación (precio, renta, región, entrada o hipoteca). Para ver el Informe PRO con estos valores necesitas usar tu crédito restante, comprar otro informe o indicar que es la misma simulación.',
  bodyNoCredit:
    'Has modificado datos clave de la operación (precio, renta, región, entrada o hipoteca). Para seguir viendo el análisis PRO con estos valores necesitas comprar otro informe o indicar que es la misma simulación.',
  exceptionsLabel: 'Excepciones "Es la misma simulación"',
  sameSimulation: 'Es la misma simulación',
  useCredit: 'Usar crédito',
  buyReport: 'Comprar informe',
  revert: 'Deshacer cambios',
  redirecting: 'Redirigiendo…',
  creditRemaining: 'restante',
};

const EN: ScenarioWarningCopy = {
  title: 'Scenario change detected',
  bodyWithCredit:
    'You changed key deal inputs (price, rent, region, down payment or mortgage). To view the PRO Report with these values you must use your remaining credit, purchase another report or mark it as the same simulation.',
  bodyNoCredit:
    'You changed key deal inputs (price, rent, region, down payment or mortgage). To keep viewing PRO analysis with these values you must purchase another report or mark it as the same simulation.',
  exceptionsLabel: '"Same simulation" exceptions',
  sameSimulation: 'Same simulation',
  useCredit: 'Use credit',
  buyReport: 'Buy report',
  revert: 'Undo changes',
  redirecting: 'Redirecting…',
  creditRemaining: 'remaining',
};

const PT: ScenarioWarningCopy = {
  title: 'Alteração de cenário detetada',
  bodyWithCredit:
    'Alterou dados chave da operação (preço, renda, região, entrada ou crédito). Para ver o Relatório PRO com estes valores precisa de usar o crédito restante, comprar outro relatório ou indicar que é a mesma simulação.',
  bodyNoCredit:
    'Alterou dados chave da operação (preço, renda, região, entrada ou crédito). Para continuar a ver a análise PRO com estes valores precisa de comprar outro relatório ou indicar que é a mesma simulação.',
  exceptionsLabel: 'Exceções "É a mesma simulação"',
  sameSimulation: 'É a mesma simulação',
  useCredit: 'Usar crédito',
  buyReport: 'Comprar relatório',
  revert: 'Anular alterações',
  redirecting: 'A redirecionar…',
  creditRemaining: 'restante',
};

const IT: ScenarioWarningCopy = {
  title: 'Modifica dello scenario rilevata',
  bodyWithCredit:
    'Hai modificato dati chiave dell\'operazione (prezzo, affitto, regione, anticipo o mutuo). Per vedere il Report PRO con questi valori devi usare il credito restante, acquistare un altro report o indicare che è la stessa simulazione.',
  bodyNoCredit:
    'Hai modificato dati chiave dell\'operazione (prezzo, affitto, regione, anticipo o mutuo). Per continuare a vedere l\'analisi PRO con questi valori devi acquistare un altro report o indicare che è la stessa simulazione.',
  exceptionsLabel: 'Eccezioni "È la stessa simulazione"',
  sameSimulation: 'È la stessa simulazione',
  useCredit: 'Usa credito',
  buyReport: 'Acquista report',
  revert: 'Annulla modifiche',
  redirecting: 'Reindirizzamento…',
  creditRemaining: 'rimanente',
};

const BY_LANG: Record<LanguageCode, ScenarioWarningCopy> = { es: ES, en: EN, pt: PT, it: IT };

export function getScenarioWarningCopy(language: LanguageCode): ScenarioWarningCopy {
  return BY_LANG[language] ?? ES;
}

export function formatExceptionsLabel(copy: ScenarioWarningCopy, remaining: number): string {
  return `${copy.exceptionsLabel}: ${remaining} / ${MAX_SAME_SIMULATION_EXCEPTIONS}`;
}
