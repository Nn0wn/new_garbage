$(document).ready(()=>{
    $.ajax({
        url: '/set/gallery',
        method: 'GET',
        success: (pictures)=>{
            for (let pic of pictures)
            {
                let table = $('#info_table');
                let row = $('<tr>').attr("scope", "row");
                let name = $('<td>').text(pic.name);
                let sprice = $('<th>').text(pic.start_price + '$');
                let buyer = $('<th>').text(pic.sold_price ? pic.buyer : '-');
                let bprice = pic.sold_price + '$';
                if(bprice === 'undefined$')
                    bprice = 'Not sold';

                row.append(name).append(sprice).append(buyer).append(bprice);
                table.append(row);
            }
        }
    })
});
