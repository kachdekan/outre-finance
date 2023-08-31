const { ethers, artifacts } = require('hardhat')
const { expect } = require('chai')
const stableTokenAbi = require('./stableToken.json')
const {customAlphabet} = require('nanoid')

describe('Clixpesa Personal Spaces', function () {
  let Personal, PersonalIface, Token, addr1, addr2
  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  before(async () => {
    const personalContract = await ethers.getContractFactory('Personal')
    Token = await ethers.getContractAt(stableTokenAbi, '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5')
    tokenDecimals = await Token.decimals()
    const signers = await ethers.getSigners()
    addr1 = signers[0]
    addr2 = signers[1]

    Personal = await personalContract.deploy()
    PersonalIface = new ethers.utils.Interface((await artifacts.readArtifact('Personal')).abi)
    await Personal.deployed()
  })

  it('Should create a personal space for ADD1 named Car Savings', async function () {
    const deadline = new Date(Date.now() + 86400000)
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const savingsData = {
      token: '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5',
      owner: addr1.address,
      spaceName: 'Car Savings',
      imgLink: 'bit.ly/hthfdrer',
      spaceId: "PS" + nanoid(),
      goalAmount: ethers.utils.parseUnits('1', tokenDecimals).toString(),
      deadline: Date.parse(deadline.toDateString() + ' 11:59 pm') 
    }
    const txResponse = await Personal.createPersonalSpace(Object.values(savingsData))
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[1][4]).to.be.equal(savingsData.spaceId)
  })

  it('Should create a personal space for ADD2 named Mjengo Nyumbani', async function () {
    const deadline = new Date(Date.now() + 172800000)
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)
    const savingsData = {
      token: '0x1e2913E1aC339a4996353f8F58BE0de3D109b5A5',
      owner: addr2.address,
      spaceName: 'Mjengo Nyumbani',
      imgLink: 'bit.ly/hthfdrer',
      spaceId: "PS" + nanoid(),
      goalAmount: ethers.utils.parseUnits('2', tokenDecimals).toString(),
      deadline: Date.parse(deadline.toDateString() + ' 11:59 pm') 
    }
    const txResponse = await Personal.connect(addr2).createPersonalSpace(Object.values(savingsData))
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[1][1]).to.be.equal(addr2.address)
  })

  it('Should return all personal spaces', async function () {
    const personalSpaces = await Personal.getAllPersonalSpaces()
    expect(personalSpaces.length).to.be.equal(2)
  })

  it('Should return all personal spaces for ADD1', async function () {
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr1.address)
    const myPersonalSpaces = await Personal.getMyPersonalSpaces()
    expect(personalSpaces.length).to.be.equal(myPersonalSpaces.length)
  })

  it('Should return ADD2 personal spaces by ID', async function () {
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr2.address)

    const thisPersonalSpace = await Personal.getPersonalSpaceById(personalSpaces[0][0][4])
    expect(thisPersonalSpace[0][1]).to.be.equal(addr2.address)
  })

  it('Should check if personal space exists', async function () {
    const isExistent = await Personal.doesPersonalSpaceExist(addr1.address, 'PS1234567890')
    expect(isExistent).to.be.equal(false)
  })

  it('Should fund ADD1 personal space', async function () {
    const amount = ethers.utils.parseUnits('1', tokenDecimals)
    const spaceBal = await Token.balanceOf(Personal.address)
    await Token.connect(addr1).approve(Personal.address, amount)
    delay(5000)
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr1.address)
    const thisPersonalSpaceBal = personalSpaces[0].currentBalance
    const txResponse = await Personal.fundPersonalSpace(personalSpaces[0][0][4], amount)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args.amount).to.be.equal(amount.toString())
    expect(spaceBal.add(amount)).to.be.equal(await Token.balanceOf(Personal.address))
    const personalSpaces2 = await Personal.getPersonalSpacesByOwner(addr1.address)
    expect(thisPersonalSpaceBal.add(amount)).to.be.equal(personalSpaces2[0].currentBalance)
  }) 

  it('Should withdraw from ADD1 personal space', async function () {
    const amount = ethers.utils.parseUnits('0.5', tokenDecimals)
    const spaceBal = await Token.balanceOf(Personal.address)
    const userBal = await Token.balanceOf(addr1.address)
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr1.address)
    const thisPersonalSpaceBal = personalSpaces[0].currentBalance
    const txResponse = await Personal.withdrawFromPersonalSpace(personalSpaces[0].SD.spaceId, amount)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args.amount).to.be.equal(amount.toString())
    expect(spaceBal.sub(amount)).to.be.equal(await Token.balanceOf(Personal.address))
    const personalSpaces2 = await Personal.getPersonalSpacesByOwner(addr1.address)
    expect(thisPersonalSpaceBal.sub(amount)).to.be.equal(personalSpaces2[0].currentBalance)
    expect(userBal.add(amount)).to.be.equal(await Token.balanceOf(addr1.address))
  })

  it('Should update name and goalAmount ADD2 personal space', async function () {
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr2.address)
    const savingsData = {
      token: personalSpaces[0].SD.token,
      owner: personalSpaces[0].SD.owner,
      spaceName: 'Mjengo Mpya',
      imgLink: personalSpaces[0].SD.imgLink,
      spaceId: personalSpaces[0].SD.spaceId,
      goalAmount: ethers.utils.parseUnits('2.5', tokenDecimals).toString(),
      deadline: personalSpaces[0].SD.deadline
    }
    const txResponse = await Personal.connect(addr2).updatePersonalSpace(Object.values(savingsData))
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args[0].SD.spaceName).to.be.equal('Mjengo Mpya')
    expect(results.args[0].SD.goalAmount).to.be.equal(ethers.utils.parseUnits('2.5', tokenDecimals).toString())
    //currentBalance should not change
    expect(results.args[0].currentBalance).to.be.equal(personalSpaces[0].currentBalance)
  })

  it('Should not withdraw from ADD2 personal space', async function () {
    const amount = ethers.utils.parseUnits('1', tokenDecimals)
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr2.address)
    const thisPersonalSpaceBal = personalSpaces[0].currentBalance
    await expect(Personal.connect(addr2).withdrawFromPersonalSpace(personalSpaces[0].SD.spaceId, amount)).to.be.revertedWith("Amount must be less than current balance")
    const personalSpaces2 = await Personal.getPersonalSpacesByOwner(addr2.address)
    expect(thisPersonalSpaceBal).to.be.equal(personalSpaces2[0].currentBalance)
  })

  it('Should fully fund ADD2 personal space', async function () {
    const spaceBal = await Token.balanceOf(Personal.address)
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr2.address)
    const thisPersonalSpaceBal = personalSpaces[0].currentBalance 
    const amount = personalSpaces[0].SD.goalAmount
    await Token.connect(addr2).approve(Personal.address, amount)
    delay(5000)
    const txResponse = await Personal.connect(addr2).fundPersonalSpace(personalSpaces[0].SD.spaceId, amount)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics })
    expect(results.args.amount).to.be.equal(amount.toString())
    expect(spaceBal.add(amount)).to.be.equal(await Token.balanceOf(Personal.address))
    const personalSpaces2 = await Personal.getPersonalSpacesByOwner(addr2.address)
    expect(thisPersonalSpaceBal.add(amount)).to.be.equal(personalSpaces2[0].currentBalance)
    expect(personalSpaces2[0].SS.currentFundState).to.be.equal(1)
  })
 
  it('Should close ADD2 personal space and withdraw all funds', async function () {
    const personalSpaces = await Personal.getPersonalSpacesByOwner(addr2.address)
    const thisPersonalSpaceBal = personalSpaces[0].currentBalance
    const userBal = await Token.balanceOf(addr2.address)
    const spaceBal = await Token.balanceOf(Personal.address)
    const txResponse = await Personal.connect(addr2).closePersonalSpace(personalSpaces[0].SD.spaceId)
    const txReceipt = await txResponse.wait()
    const thisLog = txReceipt.logs.find((el) => el.address === Personal.address)
    const results = PersonalIface.parseLog({ data: thisLog.data, topics: thisLog.topics }) 
    expect(results.args.spaceId).to.be.equal(personalSpaces[0].SD.spaceId)
    const personalSpaces2 = await Personal.getPersonalSpacesByOwner(addr2.address)
    expect(personalSpaces2[0].currentBalance).to.be.equal(0)
    expect(personalSpaces2[0].SS.currentActivityState).to.be.equal(1)
    expect(userBal.add(thisPersonalSpaceBal)).to.be.equal(await Token.balanceOf(addr2.address))
    expect(spaceBal.sub(thisPersonalSpaceBal)).to.be.equal(await Token.balanceOf(Personal.address))
    //check if timeOfClosure is LESS than deadline
    //expect(personalSpaces2[0].SS.timeOfClosure).to.be.lessThan(personalSpaces2[0].SD.deadline)

  })

})