import { create } from 'zustand';
import { AddressStore, Region, District } from '../types/adressstype'; // Import the types

const useAddressStore = create<AddressStore>((set) => ({
  // Initial states
  districts: [],
  regions: [],
  districtName: '',
  selectedRegion: null,
  selectedRegionId: null,
  regionName: '',
  editedDistrict: null,
  editedRegionName: '',
  isRegionAddModalVisible: false,
  isRegionEditModalVisible: false,
  isRegionDeleteModalVisible: false,
  isDistrictAddModalVisible: false,
  isDistrictEditModalVisible: false,
  isDistrictDeleteModalVisible: false,
  selectedDistrictForDelete: null,
  editedRegion: null,
  setEditedRegion: (region: Region | null) => set({ editedRegion: region }),
  // Actions for managing Region Name and Edited Region Name
  setRegionName: (name: string) => set({ regionName: name }),
  setEditedRegionName: (name: string) => set({ editedRegionName: name }),

  // Actions for managing Region data
  setRegions: (regions: Region[]) => set({ regions }),
  setSelectedRegion: (region: Region | null) => set({ selectedRegion: region }),
  setSelectedRegionId: (id: number | null) => set({ selectedRegionId: id }),

  // Actions for managing District data
  setDistricts: (districts: District[]) => set({ districts }),
  setDistrictName: (name: string) => set({ districtName: name }),

  // Actions for managing selected District for deletion
  setSelectedDistrictForDelete: (district: District | null) => set({ selectedDistrictForDelete: district }),
  setEditedDistrict: (district: District | null) => set({ editedDistrict: district }),

  // Modal visibility actions
  setIsRegionAddModalVisible: (visible: boolean) => set({ isRegionAddModalVisible: visible }),
  setIsRegionEditModalVisible: (visible: boolean) => set({ isRegionEditModalVisible: visible }),
  setIsRegionDeleteModalVisible: (visible: boolean) => set({ isRegionDeleteModalVisible: visible }),

  setIsDistrictAddModalVisible: (visible: boolean) => set({ isDistrictAddModalVisible: visible }),
  setIsDistrictEditModalVisible: (visible: boolean) => set({ isDistrictEditModalVisible: visible }),
  setIsDistrictDeleteModalVisible: (visible: boolean) => set({ isDistrictDeleteModalVisible: visible }),
}));

export default useAddressStore;
