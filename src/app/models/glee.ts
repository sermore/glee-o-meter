import { AbstractResource } from '../services/store-service';

export class Glee implements AbstractResource {

    id: number;
    date: Date;
    time: Date;
    text: string;
    value: number;
    userId: number;
    email: string;

    constructor(data: any = null) {
        if (data) {
            this.id = data.id ? Number(data.id) : null;
            this.date = data.date ? data.date instanceof Date ? data.date : new Date(data.date) : null;
            this.time = data.time ? data.time instanceof Date ? data.time : new Date('1970-01-01T' + data.time) : null;
            this.text = data.text ? String(data.text) : null;
            this.value = data.value ? Number(data.value) : null;
            this.userId = data.user && data.user.id ? Number(data.user.id) : null;
            this.email = data.user && data.user.email ? data.user.email : null;
            if (this.date) {
                this.date.setHours(0);
                this.date.setMinutes(0);
                this.date.setSeconds(0);
                this.date.setMilliseconds(0);
            }
            if (this.time) {
                this.time.setDate(1);
                this.time.setMonth(0);
                this.time.setFullYear(1970);
            }
        }
    }
}
