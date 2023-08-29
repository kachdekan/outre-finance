import { createSlice, createAction } from '@reduxjs/toolkit';

const spacesInitialState = {
  isLoading: true,
  selectedMembers: [],
  spaceInfo: {
    // for space creation
    name: null,
    type: null, //personal, rosca, regular, mchango
    authCode: '112233AABB',
    imgLink: null,
    members: [], //!TODO always include creator.
    goalAmount: null,
    ctbAmount: null,
    ctbDay: 'Monday',
    ctbOccurence: 'Weekly',
    disbDay: 'Tuesday',
    disbOccurence: 'Weekly',
    creator: null, //creator user address
  },
  personalSpace: {
    name: null,
    id: null,
    goalAmount: null,
    ctbAmount: 0,
    deadline: null,
    totalAmount: 0,
    recurringTransfer: 0,
    spareChange: 0,
  },
  roscaDetails: {},
  userSpaces: {
    // just add contract addresses
    roscas: [],
    personal: [],
    regular: [],
    mchango: [],
  },
  thisRosca: null,
};

const spacesSlice = createSlice({
  name: 'spaces',
  initialState: spacesInitialState,
  reducers: {
    setSelectedMembers: (state, action) => {
      state.selectedMembers = action.payload;
      state.spaceInfo.members = action.payload;
    },
    setSpaceInfo: (state, { payload }) => {
      const { spaceName, spaceType, walletAddress, defaultImg } = payload;

      state.spaceInfo.members = state.selectedMembers;
      state.spaceInfo.name = spaceName;
      state.spaceInfo.type = spaceType;
      state.spaceInfo.creator = walletAddress;
      state.spaceInfo.imgLink = defaultImg;
    },
    setCtbSchedule: (state, { payload }) => {
      (state.spaceInfo.ctbDay = payload.day), (state.spaceInfo.ctbOccurence = payload.occurrence);
    },
    setDisbSchedule: (state, { payload }) => {
      (state.spaceInfo.disbDay = payload.day), (state.spaceInfo.disbOccurence = payload.occurrence);
    },
    setGoalAmount: (state, { payload }) => {
      const size = state.spaceInfo.members.length;
      state.spaceInfo.goalAmount = payload;
      state.spaceInfo.ctbAmount = size ? payload / (state.spaceInfo.members.length + 1) : payload;
    },
    setUserSpaces: (state, { payload }) => {
      const roscas = payload.filter((s) => s.type === 'rosca');
      state.userSpaces.roscas = roscas;
    },
    setRoscaDetails: (state, { payload }) => {
      state.roscaDetails = payload;
    },
    setThisRosca: (state, { payload }) => {
      state.thisRosca = payload;
    },
  },
});

export const {
  setSelectedMembers,
  setSpaceInfo,
  setCtbSchedule,
  setDisbSchedule,
  setGoalAmount,
  setUserSpaces,
  setRoscaDetails,
  setThisRosca,
} = spacesSlice.actions;

//Created action
export const getRoscaData = createAction('spaces/getRoscaData');
export const getRoscaAddress = createAction('spaces/getRoscaAddress');
export const fetchSpaces = createAction('spaces/fetchSpaces');
export const updateSpaces = createAction('spaces/updateSpaces');

export default spacesSlice.reducer;
