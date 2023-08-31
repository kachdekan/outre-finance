export const transactions = [
  {
    id: '0',
    title: 'Bought BTC with cKES',
    credited: false,
    amount: '100.00',
    token: 'cKES',
    date: '20 Mar 2020, 11:59',
  },
  {
    id: '1',
    title: 'Money added via M-Pesa',
    type: 'deposit',
    credited: true,
    token: 'cKES',
    amount: '130.0',
    date: '20 Mar 2020, 11:59',
  },
  {
    id: '2',
    title: 'Money added to wallet',
    type: 'deposit',
    credited: true,
    amount: '150.0',
    token: 'cUSD',
    date: '20 Mar 2020, 11:59',
  },
];

export const spaces = [
  {
    id: '0x1',
    type: 'contribution',
    name: 'Masomo',
    balance: '50',
    token: 'cUSD',
    dueDate: '20 Mar 2020',
  },
  {
    id: '0x2',
    type: 'rosca',
    name: 'TMK Wanaume',
    balance: '5000',
    token: 'cUSD',
    dueDate: '20 Mar 2020',
  },
  {
    id: '0x3',
    type: 'personal',
    name: 'Vacation',
    balance: '500',
    token: 'cUSD',
    dueDate: '20 Mar 2020',
  },
];

export const roundDetails = {
  id: '0x1',
  token: 'cUSD',
  roundOwner: 'Abedy 0x1234...5678',
  roundNo: '1',
  roundBal: '1000',
  roundGoal: '5000',
  roundDueDate: '20 Mar 2020',
  memberCount: '10',
  myContribution: '0',
  ctbCount: '5',
};

export const rates = { cKES: 1, cUSD: 139.05, CELO: 139.05 * 0.485, CELOusd: 0.485, cEUR: 148.58 };

export const spareChangeList = [
  {
    id: 1,
    spareChange: 'x1',
    selected: true,
  },
  {
    id: 2,
    spareChange: 'x2',
  },
  {
    id: 3,
    spareChange: 'x3',
    selected: false,
  },
  {
    id: 4,
    spareChange: 'x4',
    selected: false,
  },
  {
    id: 5,
    spareChange: 'x5',
    selected: false,
  },
  {
    id: 6,
    spareChange: 'x10',
    selected: false,
  },
];

export const LoansData = [
  {
    title: 'Active Loans',
    data: [
      {
        id: 'LN001',
        name: 'Akimbo <> Chamaa', // derive name from participants
        principal: '5000', // amount payable if payed on time
        dueDate: '20 Mar 2020',
        token: 'cUSD',
        isPending: true,
        currentBal: '1000',
        paid: '4000',
        isLender: false, // derive and show lender
      },
      {
        id: 'LN002',
        name: 'Akimbo <> Kachi',
        principal: '3000',
        dueDate: '20 Mar 2020',
        token: 'cUSD',
        isPending: false,
        currentBal: '1000',
        paid: '2000',
        lender: false,
      },
    ],
  },
  {
    title: 'Loan Offers',
    data: [
      {
        id: 'LO001',
        token: 'cUSD',
        from: 'Akimbo Keya',
        type: 'individual', // or "group
        lendingPool: '10000',
        minAmount: '500',
        maxAmount: '1000',
        minDuration: '7', //days
        maxDuration: '21', //weeks
        interest: '5', //percent
      },
    ],
  },
  {
    title: 'Loan Requests',
    data: [
      {
        id: 'LO002',
        from: 'Dekan Kachi',
        type: 'individual', // or "group
        token: 'cUSD',
        principal: '3000',
        minDuration: '7', //days
        maxDuration: '21', //weeks
        interest: '5', //percent
        creditScore: '5',
      },
    ],
  },
];

export const pockets = [
  {
    id: 'RP001',
    name: 'Masomo',
    balance: '50',
    goal: '500',
    token: 'cUSD',
    dueDate: '20 Mar 2020',
    type: 'contribution',
    idInitiator: true,
  },
];
