const assert = require("assert");
const users = require('../routes/users');

function test_addpicture(name, picAquired) {
    let t_mem = [{name:'Vasya', Aquisitions:[], money: 100000}];
    let notHere = true;
    for (let mem of t_mem)
        if (mem.name === name) {
            notHere = false;
            break;
        }
    if (notHere)
        return Promise.reject();
    else {
        for (let id in t_mem)
            if (t_mem[id].name === name) {
                t_mem[id].Aquisitions[t_mem[id].Aquisitions.length] = picAquired;
                t_mem[id].money -= picAquired.sold_price;
            }
        return Promise.resolve(t_mem);
    }

}

function test_adduser(name){
    let t_mem = [];
    let isHere = false;
    for (let mem of t_mem)
        if (mem.name === name) {
            isHere = true;
            return Promise.reject();
        }
    if (!isHere) {
        let len = t_mem.length;
        t_mem[len] = {"name": name, "Aquisitions": [], "money": 1000000};
        return Promise.resolve(t_mem);
    }
}

describe("users", function () {
    it("User Add test", (done) => {
        test_adduser('Vasya').then((usersres)=>{
            assert.equal(usersres[0].name, 'Vasya');
            assert.equal(usersres[0].money, 1000000);
            done();
        }).catch((error)=>{done(error)});
    });

    it("Picture Bought test", (done) => {
        test_addpicture('Vasya', {name:'test', sold_price:1000}).then((usersres)=>{
            assert.equal(usersres[0].name, 'Vasya');
            assert.equal(usersres[0].money, 100000 - 1000);
            assert.equal(usersres[0].Aquisitions[0].name, 'test');
            assert.equal(usersres[0].Aquisitions[0].sold_price, 1000);
            done();
        }).catch((error)=>{done(error)});
    });
});


