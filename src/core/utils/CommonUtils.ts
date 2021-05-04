import { createBrowserHistory } from 'history';
import Config from 'core/Config';

/**
 * history instance so we can navigate programatically
 */
export const history = createBrowserHistory();

/**
 * Returns the index if teh element is in the array.
 * Otherwise returns -1
 */
export const isInArray = (array: Array<number[]>, element: number): number => {
  for (let index = 0; index < array.length; index++) {
    if (array[index][0] === element) {
      return index;
    }    
  }

  return -1;
}

/**
 * Formats the number based on the locale defined in the config
 */
export const formatNumber = (number: number) => {
  return new Intl.NumberFormat(Config.locale).format(number);
};