const { ethers, artifacts } = require('hardhat')
const { expect } = require('chai')
const stableTokenAbi = require('./stableToken.json')
const {customAlphabet} = require('nanoid')

describe('Clixpesa P2P Loans', function () {
  let P2PLoans, P2PLoansIface, Token, addr1, addr2, addr3
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  before(async () => {
    const loansContract = await ethers.getContractFactory('P2PLoans')
    Token = await ethers.getContractAt(stableTokenAbi, '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5')
    tokenDecimals = await Token.decimals()
    const signers = await ethers.getSigners()
    addr1 = signers[0]
    addr2 = signers[1]
    addr3 = signers[2]

    P2PLoans = await loansContract.deploy()
    P2PLoansIface = new ethers.utils.Interface((await artifacts.readArtifact('P2PLoans')).abi)
    await P2PLoans.deployed()
  })


  it('Should Create a Loan Request for ADD1', async function () {
    
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const requestData = {
      loanId: "LN" + nanoid(), //use LN as prefix for loan id; prefer LR
      token : Token.address,
      initiator: addr1.address,
      principal: ethers.utils.parseUnits('1', tokenDecimals).toString(),
      interest: 5 * 100,
      minDuration: 7 * 24 * 60 * 60,
      maxDuration: 14 * 24 * 60 * 60,
      bCreditScore: 2.5 * 100,
      isPrivate: false,
    }
    console.log("Creating a Request: ", requestData.loanId)
    const txResponse = await P2PLoans.createLoanRequest(Object.values(requestData))
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === P2PLoans.address)
    const results = P2PLoansIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[1][0]).to.be.equal(requestData.loanId)
    expect(await P2PLoans.getAvailableRequests()).to.have.lengthOf(1)
    expect(await P2PLoans.getRequestsByOwner(addr1.address)).to.have.lengthOf(1)
  })

  it('ADD2 Should Fund ADD1s Loan Request', async function () {
    const add1Requests = await P2PLoans.getRequestsByOwner(addr1.address)
    const loanId = add1Requests[0].loanId
    const loanAmount = add1Requests[0].principal
    const borrowerBal = await Token.balanceOf(addr1.address)
    await Token.connect(addr2).approve(P2PLoans.address, loanAmount)
    delay(3000)
    console.log("Funding this Request:",loanId)
    const txResponse = await P2PLoans.connect(addr2).fundLoanRequest(loanId)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === P2PLoans.address)
    const results = P2PLoansIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args.P2PLD.LP.lender).to.be.equal(addr2.address)
    expect(results.args.P2PLD.LP.borrower).to.be.equal(addr1.address)
    expect(results.args.P2PLD.currentBalance).to.be.equal(loanAmount)
    expect(borrowerBal.add(loanAmount)).to.be.equal(await Token.balanceOf(addr1.address))
    expect(await P2PLoans.getAvailableRequests()).to.have.lengthOf(0)
    expect(await P2PLoans.getRequestsByOwner(addr1.address)).to.have.lengthOf(0)
  })

  it('ADD2 Should Create a Request too', async function () {
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const requestData = {
      loanId: "LN" + nanoid(), //use LN as prefix for loan id; prefer LR
      token : Token.address,
      initiator: addr2.address,
      principal: ethers.utils.parseUnits('1', tokenDecimals).toString(),
      interest: 5 * 100,
      minDuration: 7 * 24 * 60 * 60,
      maxDuration: 14 * 24 * 60 * 60,
      bCreditScore: 2.5 * 100,
      isPrivate: false,
    }
    console.log("Creating a Request: ", requestData.loanId)
    const txResponse = await P2PLoans.connect(addr2).createLoanRequest(Object.values(requestData))
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === P2PLoans.address)
    const results = P2PLoansIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[1][0]).to.be.equal(requestData.loanId)
    expect(await P2PLoans.getAvailableRequests()).to.have.lengthOf(1)
    expect(await P2PLoans.getRequestsByOwner(addr2.address)).to.have.lengthOf(1)
    const thisRequest = await P2PLoans.getRequestById(requestData.loanId)
    expect(thisRequest.initiator).to.be.equal(requestData.initiator)
  })

  it('ADD1 Should Pay back loan with ADD2', async function () {
    const amount = ethers.utils.parseUnits('0.5', tokenDecimals)
    const p2pLoans = await P2PLoans.getP2PLoansByOwner(addr1.address)
    const loanId = p2pLoans[0].LD.loanId
    const lenderBal = await Token.balanceOf(addr2.address)
    await Token.connect(addr1).approve(P2PLoans.address, amount)
    delay(3000)
    console.log("Paying back loan:",loanId)
    const txResponse = await P2PLoans.connect(addr1).repayLoan(loanId, amount)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === P2PLoans.address)
    const results = P2PLoansIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args.loanId).to.be.equal(loanId)
    expect(lenderBal.add(amount)).to.be.equal(await Token.balanceOf(addr2.address))
    const thisLoan = await P2PLoans.getP2PLoanById(loanId)
    expect(thisLoan.currentBalance).to.be.equal(p2pLoans[0].currentBalance.sub(amount))
  })
  
  it('Should Create a Loan Offer for ADD2', async function () {
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const offerDeatils = {
      loanId: "LO" + nanoid(), //prefer LO
      token : Token.address,
      initiator: addr2.address,
      principal: ethers.utils.parseUnits('3', tokenDecimals).toString(),
      interest: 5 * 100,
      minDuration: 7 * 24 * 60 * 60,
      maxDuration: 14 * 24 * 60 * 60,
      minCreditScore: 2.5 * 100,
      isPrivate: false
    }
    const offerData = {
      LD: Object.values(offerDeatils),
      minLoanAmount: ethers.utils.parseUnits('0.5', tokenDecimals).toString(),
      maxLoanAmount: ethers.utils.parseUnits('3', tokenDecimals).toString(),
    }
    console.log("Creating a Loan Offer: ", offerData.LD[0])
    const txResponse = await P2PLoans.connect(addr2).createLoanOffer(Object.values(offerData))
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === P2PLoans.address)
    const results = P2PLoansIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args.OLD.LD.loanId).to.be.equal(offerData.LD[0])
    expect(await P2PLoans.getAvailableOffers()).to.have.lengthOf(1)
    expect(await P2PLoans.getOffersByOwner(addr2.address)).to.have.lengthOf(1)
    const thisOffer = await P2PLoans.getOfferById(offerData.LD[0])
    expect(thisOffer.LD.initiator).to.be.equal(addr2.address)
  })

  it('ADD1 Should Borrow from Loan Offer', async function () {
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const amount = ethers.utils.parseUnits('1', tokenDecimals)
    const p2pOffers = await P2PLoans.getOffersByOwner(addr2.address)
    const offerId = p2pOffers[0].LD.loanId
    const loanId = "LN" + nanoid()
    const duration = 7 * 24 * 60 * 60
    await Token.connect(addr1).approve(P2PLoans.address, amount)
    delay(3000)
    console.log("Borrowing from Loan Offer:", offerId)
    const txResponse = await P2PLoans.connect(addr1).borrowFromOffer(offerId, loanId, amount, duration)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === P2PLoans.address)
    const results = P2PLoansIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args.P2PLD.LD.loanId).to.be.equal(loanId)
    const thisLoan = await P2PLoans.getP2PLoanById(loanId)
    expect(thisLoan.LD.principal).to.be.equal(amount)
    expect(thisLoan.currentBalance).to.be.equal(0)
    expect(thisLoan.LD.initiator).to.be.equal(addr2.address)
    expect(thisLoan.LS).to.be.equal(0)

    const thisOffer = await P2PLoans.getOfferById(offerId)
    expect(thisOffer.LD.principal).to.be.equal(p2pOffers[0].LD.principal.sub(amount))
  })

  it('ADD3 Should Borrow from Loan Offer and Offer should be removed', async function () {
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const amount = ethers.utils.parseUnits('1.8', tokenDecimals)
    const p2pOffers = await P2PLoans.getOffersByOwner(addr2.address)
    const offerId = p2pOffers[0].LD.loanId
    const loanId = "LN" + nanoid()
    const duration = 11 * 24 * 60 * 60
    delay(3000)
    console.log("Borrowing from Loan Offer:", offerId)
    const txResponse = await P2PLoans.connect(addr3).borrowFromOffer(offerId, loanId, amount, duration)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === P2PLoans.address)
    const results = P2PLoansIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args.P2PLD.LD.loanId).to.be.equal(loanId)
    expect(await P2PLoans.getAvailableOffers()).to.have.lengthOf(0)
  })

  it('ADD2 Should Fund both ADD1 and ADD3 pending loans', async function () {
    const p2pLoans = await P2PLoans.getP2PLoansByOwner(addr2.address)
    const add2Bal = await Token.balanceOf(addr2.address)
    //find pending loans 
    const pendingLoans = p2pLoans.filter((el) => el.LS === 0)
    expect (pendingLoans).to.have.lengthOf(2)

    //fund the first pending loan
    const loanId1 = pendingLoans[0].LD.loanId
    const amount1 = pendingLoans[0].LD.principal
    const borrower1Bal = await Token.balanceOf(pendingLoans[0].LP.borrower)
    await Token.connect(addr2).approve(P2PLoans.address, amount1)
    delay(3000)
    console.log("Funding Loan:", loanId1)
    const txResponse1 = await P2PLoans.connect(addr2).fundPendingLoan(loanId1)
    const txReceipt1 = await txResponse1.wait()
    const thisLog1 = txReceipt1.logs.find((el) => el.address === P2PLoans.address)
    const results1 = P2PLoansIface.parseLog({ data: thisLog1.data, topics: thisLog1.topics })
    expect(results1.args.amount).to.be.equal(amount1)
    const thisLoan1 = await P2PLoans.getP2PLoanById(loanId1)
    expect(thisLoan1.currentBalance).to.be.equal(amount1)
    expect(thisLoan1.LS).to.be.equal(1)
    expect(await Token.balanceOf(pendingLoans[0].LP.borrower)).to.be.equal(borrower1Bal.add(amount1))

    //fund the second pending loan
    const loanId2 = pendingLoans[1].LD.loanId
    const amount2 = pendingLoans[1].LD.principal
    const borrower2Bal = await Token.balanceOf(pendingLoans[1].LP.borrower)
    await Token.connect(addr2).approve(P2PLoans.address, amount2)
    delay(3000)
    console.log("Funding Loan:", loanId2)
    const txResponse2 = await P2PLoans.connect(addr2).fundPendingLoan(loanId2)
    const txReceipt2 = await txResponse2.wait()
    const thisLog2 = txReceipt2.logs.find((el) => el.address === P2PLoans.address)
    const results2 = P2PLoansIface.parseLog({ data: thisLog2.data, topics: thisLog2.topics })
    expect(results2.args.amount).to.be.equal(amount2)
    const thisLoan2 = await P2PLoans.getP2PLoanById(loanId2)
    expect(thisLoan2.currentBalance).to.be.equal(amount2)
    expect(thisLoan2.LS).to.be.equal(1)
    expect(await Token.balanceOf(pendingLoans[1].LP.borrower)).to.be.equal(borrower2Bal.add(amount2))

    //check that ADD2 balance is reduced by the sum of the two loans
    expect(await Token.balanceOf(addr2.address)).to.be.equal(add2Bal.sub(amount1).sub(amount2))

  })

})