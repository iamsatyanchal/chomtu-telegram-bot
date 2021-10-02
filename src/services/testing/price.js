import { fetchHTML } from '../../helpers';

export default async function priceCheck() {
  const priceData = fetchHTML('https://www.amazon.in/realme-Wired-Earphones-Android-Smartphones/dp/B097KM3Z16');
  
  priceData.then(res => {
    let price = Number(res('tr#priceblock_ourprice_row > td.a-span12 > #priceblock_ourprice ').text().substr(1));
    
    if (price === 499.00) {
      console.log('Price same hai bhai');
    } else if (price < 499.00) {
      console.log('price kum hua');
    }

  }).catch(e => {
    console.log(e.message);
  })
}