import { create } from 'zustand';

export const usePropertyStore = create((set) => ({
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,

  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  addProperty: (property) =>
    set((state) => ({
      properties: [...state.properties, property],
    })),
  updateProperty: (id, updates) =>
    set((state) => ({
      properties: state.properties.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  removeProperty: (id) =>
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export const useOfferStore = create((set) => ({
  offers: [],
  selectedOffer: null,
  loading: false,
  error: null,

  setOffers: (offers) => set({ offers }),
  setSelectedOffer: (offer) => set({ selectedOffer: offer }),
  addOffer: (offer) =>
    set((state) => ({
      offers: [...state.offers, offer],
    })),
  updateOffer: (id, updates) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      ),
    })),
  removeOffer: (id) =>
    set((state) => ({
      offers: state.offers.filter((o) => o.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export const useDisclosureStore = create((set) => ({
  disclosures: [],
  selectedDisclosure: null,
  loading: false,
  error: null,

  setDisclosures: (disclosures) => set({ disclosures }),
  setSelectedDisclosure: (disclosure) => set({ selectedDisclosure: disclosure }),
  addDisclosure: (disclosure) =>
    set((state) => ({
      disclosures: [...state.disclosures, disclosure],
    })),
  updateDisclosure: (id, updates) =>
    set((state) => ({
      disclosures: state.disclosures.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),
  removeDisclosure: (id) =>
    set((state) => ({
      disclosures: state.disclosures.filter((d) => d.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  userRole: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      userRole: user?.role || null,
    }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      userRole: null,
    }),
}));
