# Auction

  

This project is a non-production smart contract with auction functionality. It needs a hardhat version that's above 2.9.0 because it uses the "hardhat_mine" function.

  

## Getting Started

  

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

  

### Prerequisites

  

Use proper node version

  

```bash

# Install nvm

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# Install proper node version

nvm use

```

### Installing

  

Get a development environment running

  

Install the project's dependencies

  

```bash

# Install the dependencies

npm install

```

  

### Generate Types

  

In order to get contract types you can generate those typings when compiling

  

```bash

npm run compile

```

  

## Running the tests

  

```bash

npm run test

```

  

### Testing with Waffle

  

Tests using Waffle are written with Mocha alongside with Chai.

  

Is recommended to use Gherkin as a language to describe the test cases

  

```

describe("Feature: Greeter", () => {

describe("Scenario: Should return the new greeting once it's changed", () => {

let greeter: Greeter;

it("GIVEN a deployed Greeter contract", async () => {

const factory = await ethers.getContractFactory("Greeter");

greeter = <Greeter>await factory.deploy("Hello, world!");

expect(await greeter.greet()).to.equal("Hello, world!");

});

it("WHEN greeting message changed", async () => {

await greeter.setGreeting("Hola, mundo!");

});

it("THEN greet returns new greeting message", async () => {

expect(await greeter.greet()).to.equal("Hola, mundo!");

});

});

});

```

  

We are requiring Chai which is an assertions library. These asserting functions are called "matchers", and the ones we're using here actually come from Waffle.

  

For more information we suggest reading waffle testing documentation [here](https://hardhat.org/guides/waffle-testing.html#testing).

  

## Scripts

  

```bash

  

npm run compile #Compile the contract

npm run test  #Runs automated tests

npm run lint #Executes a linter over your files

npm run format #Executes a prettier over your files

npm run node #Runs a local mockchain

npm run deploy-local #Deploys the contract in a local network

npm run console-local #Runs an interactive console pointing to the local network

  

```

  

## Deployment

  

To deploy your contract locally

  

- Run a local mockchain: `npm run node`

- Open another terminal and deploy your contracts locally: `npm run deploy-local`

- You can interact with your contract through the console: `npm run console-local`

  

## Built With

  

* [Hardhat](https://hardhat.org/) - Task runner

  

## Contributing

  

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

  
  

## License

  

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/IQAndreas/markdown-licenses) file for details

  

## Hashes

Cryptographic hash functions transform text or binary data to fixed-length hash value and are known to be collision-resistant and irreversible.

Cryptographic hash functions cannot be reversed, so they are widely used to encode an input without revealing it.

Different input messages are expected to produce different output hashs values.

Theoretically there can be collisions (same output value for different inputs) when using cryptographic hashing functions but they are supposed to be extremely unlikely to find so crypto hashes are treated as almost unique identifiers of the input.

The ideal cryptographic hash function should have the following properties:
- Deterministic: the same input message should always result in the same hash value.
- Quick: it should be fast to compute the hash value for any given message.
- Hard to analyze: a small change to the input message should totally change the output hash value.
- Irreversible: generating a valid input message from its hash value should be infeasible. This means that there should be no significantly better way than brute force (try all possible input messages).
- No collisions: it should be extremely hard (or practically impossible) to find two different messages with the same hash.

Hash functions can be used to check document integrity (i.e. checksum), to securely store passwords, to generate unique IDs and pseudorandom numbers, and for PoW algorithms among other uses

## Digital Signatures

Digital signatures are a cryptographic tool to sign messages and verify message signature in order to provide proof of authenticity

Digital signatures can provide message authentication, integrity and non-repudiation.

A digital certificate can be used in combination with the signature to bind a public key owner with identity. 

Digital signatures bind messages to public keys, not to digital identities.

Digital signature schemes typically use a public/private key pair. The private key is used to sign and the public key to verify.