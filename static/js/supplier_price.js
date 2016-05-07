function calcSalePrice(cost){
    var salePrice = NaN;
    if(!isNaN(cost)){
        cost = parseFloat(cost);
        if(cost <= 15){
            if(cost <= 10)
                salePrice = 19.9;
            else
                salePrice = 29.9;
        }
        else{
            var onSalePrice = Math.round(cost / .65 + 8);
            var onSalePriceStr = String(onSalePrice);
            var lastDigit = parseInt(onSalePriceStr[onSalePriceStr.length - 1]);
            if(lastDigit < 5)
                salePrice = Math.max(Math.floor(onSalePrice / 10) - 1, 0) * 10 + 9.9;
            else
                salePrice = Math.floor(onSalePrice / 10) * 10 + 9.9;

            if(salePrice > 9.9  && salePrice <= 39.9)
                salePrice = 39.9;
            else if(salePrice > 99.9 && salePrice <= 109.9)
                salePrice = 99.9;
        }
    }
    return salePrice;
}
