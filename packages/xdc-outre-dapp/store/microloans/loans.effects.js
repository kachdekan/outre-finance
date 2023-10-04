import { fetchLoans, fetchOffers, setOffers, updateLoans } from './loans.slice';

export const loansListeners = (startListening) => {
  startListening({
    actionCreator: fetchOffers,
    effect: async (action, listenerApi) => {
      const { dispatch, query } = listenerApi;
      const offers = await query.getOffers();
      dispatch(setOffers(offers));
    },
  });
};
