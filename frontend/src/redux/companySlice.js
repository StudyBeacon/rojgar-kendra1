import { createSlice } from "@reduxjs/toolkit"

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [],
    searchCompanyText: "",
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload
    },
    setCompanies: (state, action) => {
      state.companies = action.payload
    },
    setSearchCompanyText: (state, action) => {
      state.searchCompanyText = action.payload
    },
  },
})

export const { setSingleCompany, setCompanies, setSearchCompanyText } =
  companySlice.actions
export default companySlice
