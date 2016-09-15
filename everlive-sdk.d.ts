declare module 'everlive-sdk' {
    interface A_Static {
        new(m: any): A_Instance;
    }
    interface A_Instance {
        inst: number;
    }
    var A: A_Static;
    export = A;
}