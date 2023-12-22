import {Injectable} from '@angular/core';
import {environment} from "../environment/environment";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {Subject} from "rxjs";

import Web3Modal from "web3modal";

import Web3 from "web3";

import WalletConnectProvider from "@walletconnect/web3-provider";
import {Company} from "./interfaces/Company";
import {Product} from "./interfaces/Product";
import {ethers} from "ethers";
import {Delivery} from "./interfaces/Delivery";

@Injectable({
  providedIn: 'root'
})
export class ClearOriginService {
  cCompany: any;

  contractAbi: any;

  private web3js: any;
  private provider: any;
  private accounts: any;
  web3Modal

  uDonate: any;

  private testVariable = 'default';

  private accountStatusSource = new Subject<any>();
  accountStatus$ = this.accountStatusSource.asObservable();

  constructor(
    private httpClient: HttpClient
  ) {

    this.httpClient.get('/assets/abis/_app_contracts_ClearOriginNetwork_sol_ClearOriginNetwork.abi').subscribe(x => {
      this.contractAbi = x;
    })

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "INFURA_ID" // required
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });


  }


  async connectAccount() {
    this.web3Modal.clearCachedProvider();

    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    this.accountStatusSource.next(this.accounts)
  }


  async createOrganization(companyName: string, wallet_address: string, companyProducts: string[] = []) {
    // --- temporarily re-initializating these for the effect file
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    console.log(this.accounts);

    this.uDonate = new this.web3js.eth.Contract(this.contractAbi, environment.contractAddress);

    console.log(Web3.utils.asciiToHex(companyName));
    console.log(Web3.utils.fromAscii("test"));


    const create = await this.uDonate
      .methods.addCompany(
        Web3.utils.fromAscii(companyName).padEnd(66, '0'),
        wallet_address,
        companyProducts.map(x => {
          return Web3.utils.fromAscii(x).padEnd(66, '0')
        })
      )
      .send({from: this.accounts[0]});

    return create;
  }

  async getCompany(address: string): Promise<Company> {
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    console.log(this.accounts);

    this.uDonate = new this.web3js.eth.Contract(this.contractAbi, environment.contractAddress);


    const companyArrays = await this.uDonate
      .methods.getCompany(address)
      .call();

    const companyName = Web3.utils.hexToAscii(companyArrays[0])
    const products = companyArrays[1].map((c: any) => {
      return Web3.utils.hexToAscii(c)
    })

    return {
      name: companyName,
      products: products,
      walletAddress: address
    }
  }


  async getCompanies(): Promise<Company[]> {
    // --- temporarily re-initializating these for the effect file
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    console.log(this.accounts);

    this.uDonate = new this.web3js.eth.Contract(this.contractAbi, environment.contractAddress);


    const companyArrays = await this.uDonate
      .methods.getCompanies()
      .call();

    const companyNames = companyArrays[0].map((x: any) => {
      return Web3.utils.hexToAscii(x)
    })

    const companyAddresses = companyArrays[1].map((x: any) => {
      return x
    })

    const companyProducts = companyArrays[2].map((x: any) => {
      return x.map((c: any) => {
        return Web3.utils.hexToAscii(c)
      })
    })

    const companies: Company[] = []

    companyNames.forEach((x: any, index: any) => {
      companies.push({
        name: x,
        walletAddress: companyAddresses[index],
        products: companyProducts[index]
      })
    })

    console.log(companies)

    return companies;
  }

  async createDelivery(products: Product[]) {
    // --- temporarily re-initializating these for the effect file
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    console.log(this.accounts);

    this.uDonate = new this.web3js.eth.Contract(this.contractAbi, environment.contractAddress);


    const itemNames = products.map(x => {
      return x.itemName;
    });

    const numberOfItems = products.map(x => {
      return x.numberOfItems;
    });
    console.log(numberOfItems)

    const create = await this.uDonate
      .methods.safeMint(
        itemNames.map(x => {
          return Web3.utils.fromAscii(x).padEnd(66, '0')
        }),
        numberOfItems.map(x => {
          return Web3.utils.numberToHex(x);
        })
      )
      .send({from: this.accounts[0]});
  }


  async getAdmins() {
    // --- temporarily re-initializating these for the effect file
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    this.uDonate = new this.web3js.eth.Contract(this.contractAbi, environment.contractAddress);


    const create = await this.uDonate
      .methods.getAdmins().send({from: this.accounts[0]}).on('transactionHash', function (hash: any) {
        // Transaction hash is available here
        console.log('Transaction Hash:', hash);
      })
      .on('receipt', function (receipt: any) {
        // Transaction receipt is available here
        console.log('Transaction Receipt:', receipt);

        // You can fetch the result from the receipt or make another call to get the result
        const result = receipt.events;
        console.log('Result:', result);
      })
      .on('error', function (error: any) {
        // Handle error here
        console.error('Error:', error);
      });


    return create;
  }

  public setTestVar(): void {
    this.testVariable = 'set to diffrent value '
  }

  public get testVar() {
    return this.testVariable;
  }


  public async getDeliverys(address: string) {
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    console.log(this.accounts);

    this.uDonate = new this.web3js.eth.Contract(this.contractAbi, environment.contractAddress);

    const accountAddress = address;

    const ballance = await this.uDonate.methods.balanceOf(accountAddress).call()
    console.log(ballance.toString())

    const tokenIds = [];

    for (let i = 0; i < ballance; i++) {
      tokenIds.push(await this.uDonate.methods.tokenOfOwnerByIndex(accountAddress, i).call());
    }


    const deliveries: Delivery[] = [];

    for (const x of tokenIds) {
      const response = await this.uDonate.methods.getDelivery(x).call()

      const products: Product[] = [];

      response[0].forEach((productName: any, index: any) => {
        products.push({
          itemName: Web3.utils.hexToAscii(productName),
          numberOfItems: Number(response[1][index])
        })
      })

      deliveries.push({
        deliveryId: Number(x),
        products: products
      })
    }

    return deliveries;
  }


  public async getHistoryOfNFT(tokenId: number) {


    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    console.log(this.accounts);

    this.uDonate = new this.web3js.eth.Contract(this.contractAbi, environment.contractAddress);

    const events = await this.uDonate.getPastEvents(
      "Transfer", {
        fromBlock: 0,
        filter: {
          tokenId: tokenId
        }
      }
    )

    const walletHistory = events.map((x: any) => {
      return {
        from: x.returnValues.from,
        to: x.returnValues.to
      }
    })

    const walletOrder: any[] = [];

    walletHistory.forEach((x: any, index: any) => {
      if (index == 0) {
        walletOrder.push(x.from);
        walletOrder.push(x.to);
      } else {
        walletOrder.push(x.to);
      }
    });

    return walletOrder;
  }
}
