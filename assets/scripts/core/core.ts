(async function () {
    async function test1() {
        for (let i = 0; i < 1000000000; i++);
        return 11;
    }

    async function test2() {
        for (let i = 0; i < 1000000000; i++);
        return 22;
    }

    async function test3() {
        for (let i = 0; i < 100000000000; i++);
        return 3333;
    }

    let res11 = await test1();
    console.log(res11);

    test3().then((res) => {console.log(res)});

    let res22 = await test2();
    console.log(res22);

    console.log(3);
})();