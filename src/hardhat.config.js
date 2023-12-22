require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    networks: {
        hardhat: {
            accounts:
                [
                    {// PrismaTextilManufaktur
                        privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
                        balance: '1000000000000000000'
                    },
                    // { // EleganzLogistik Solutions
                    //     privateKey: '0xde9ba858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0',
                    //     balance: '5000000000000000000'
                    // },
                    // {// Gucci
                    //     privateKey: '0x1dff16e66c3c16e115f81745fd7be82d0360836588cbbfd91b7aa60b8c9e81bc',
                    //     balance: '5000000000000000000'
                    // },
                    // {// Louis vuitton
                    //     privateKey: '0xdx9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0',
                    //     balance: '5000000000000000000'
                    // },
                    // {// Zalando
                    //     privateKey: '0xde9ba858d74a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0',
                    //     balance: '5000000000000000000'
                    // },
                    // {// Boutique Franz Meier
                    //     privateKey: '0xde9ba858d74a475276426320d5e9262ecfx3ba460bfac56360bfa6c4c28b4ee0',
                    //     balance: '5000000000000000000'
                    // },
                    // {
                    //     privateKey: '0xde9ba858d74a475276426320d5e9262ecfx3ba460bfac57360bfa6c4c28b4ee0',
                    //     balance: '5000000000000000000'
                    // }
                ]
        }
    }
};
