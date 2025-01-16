import {create} from "zustand";

interface AddressStore {
    // State variables
    districts: any[];
    regions: any[];
    districtName: string;
    regionName: string;
    selectedRegionId: number | null;
    editedDistrict: any | null;
    editedRegion: any | null;
    isDistrictAddModalVisible: boolean;
    isDistrictEditModalVisible: boolean;
    isDistrictDeleteModalVisible: boolean;
    isRegionAddModalVisible: boolean;
    isRegionEditModalVisible: boolean;
    isRegionDeleteModalVisible: boolean;

    // Setters
    setDistricts: (districts: any[]) => void;
    setRegions: (regions: any[]) => void;
    setDistrictName: (name: string) => void;
    setRegionName: (name: string) => void;
    setSelectedRegionId: (id: number | null) => void;
    setEditedDistrict: (district: any | null) => void;
    setEditedRegion: (region: any | null) => void;
    setIsDistrictAddModalVisible: (visible: boolean) => void;
    setIsDistrictEditModalVisible: (visible: boolean) => void;
    setIsDistrictDeleteModalVisible: (visible: boolean) => void;
    setIsRegionAddModalVisible: (visible: boolean) => void;
    setIsRegionEditModalVisible: (visible: boolean) => void;
    setIsRegionDeleteModalVisible: (visible: boolean) => void;
}

const useAddressStore = create<AddressStore>((set) => ({
    // Initial state
    districts: [],
    regions: [],
    districtName: "",
    regionName: "",
    selectedRegionId: null,
    editedDistrict: null,
    editedRegion: null,
    isDistrictAddModalVisible: false,
    isDistrictEditModalVisible: false,
    isDistrictDeleteModalVisible: false,
    isRegionAddModalVisible: false,
    isRegionEditModalVisible: false,
    isRegionDeleteModalVisible: false,

    // Setters
    setDistricts: (districts) => set({ districts }),
    setRegions: (regions) => set({ regions }),
    setDistrictName: (name) => set({ districtName: name }),
    setRegionName: (name) => set({ regionName: name }),
    setSelectedRegionId: (id) => set({ selectedRegionId: id }),
    setEditedDistrict: (district) => set({ editedDistrict: district }),
    setEditedRegion: (region) => set({ editedRegion: region }),
    setIsDistrictAddModalVisible: (visible) => set({ isDistrictAddModalVisible: visible }),
    setIsDistrictEditModalVisible: (visible) => set({ isDistrictEditModalVisible: visible }),
    setIsDistrictDeleteModalVisible: (visible) => set({ isDistrictDeleteModalVisible: visible }),
    setIsRegionAddModalVisible: (visible) => set({ isRegionAddModalVisible: visible }),
    setIsRegionEditModalVisible: (visible) => set({ isRegionEditModalVisible: visible }),
    setIsRegionDeleteModalVisible: (visible) => set({ isRegionDeleteModalVisible: visible }),
}));

export default useAddressStore;
