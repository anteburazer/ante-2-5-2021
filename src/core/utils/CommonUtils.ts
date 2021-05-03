import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const isInArray = (array: Array<number[]>, element: number): number => {
  for (let index = 0; index < array.length; index++) {
    if (array[index][0] === element) {
      return index;
    }    
  }

  return -1;
}

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-US").format(number);
};