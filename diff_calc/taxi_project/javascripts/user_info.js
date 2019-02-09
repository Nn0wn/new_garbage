export default class User{
    constructor(n, tel, st = '', dest, cost){
        this.name = n;
        this.telephone = tel;
        this.start_point = st;
        this.dest_point = dest;
        this.cost = cost;
    }
}