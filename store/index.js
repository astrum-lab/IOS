import zustand from 'zustand';

const useStore = zustand(set => ({
  user: {},
  route: 'home',
  setUser: user => set({user}),
  setRoute: route => set({route}),
}));

export default useStore;
