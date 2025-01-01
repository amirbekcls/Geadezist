// AddressType.ts (or your types file)

// Region interface
export interface Region {
  id: number;
  name: string;
}

// District interface
export interface District {
  id: number;
  name: string;
  regionId: string | number;
  regionName: string;
}

// AddressStore interface
export interface AddressStore {
  districts: District[]; // List of districts
  regions: Region[]; // List of regions
  districtName: string; // District name (for input)
  selectedRegion: Region | null; // Selected region object
  selectedRegionId: number | null; // Selected region id
  regionName: string; // Region name (for input)
  editedDistrict: District | null; // Edited district
  editedRegionName: string | number; // Edited region name
  isRegionAddModalVisible: boolean; // Modal visibility for adding a region
  isRegionEditModalVisible: boolean; // Modal visibility for editing a region
  isRegionDeleteModalVisible: boolean; // Modal visibility for deleting a region
  isDistrictAddModalVisible: boolean; // Modal visibility for adding a district
  isDistrictEditModalVisible: boolean; // Modal visibility for editing a district
  isDistrictDeleteModalVisible: boolean; // Modal visibility for deleting a district
  selectedDistrictForDelete: District | null; // District selected for deletion
  editedRegion: Region | null; // Edited region (store the whole object)

  // Actions
  // ... other properties
  setEditedRegion: (region: Region | null) => void; // Update action
  setRegionName: (name: string) => void;
  
  setEditedRegionName: (name: string) => void;
  setRegions: (regions: Region[]) => void;
  setSelectedRegion: (region: Region | null) => void;
  setSelectedRegionId: (id: number | null) => void;
  setDistricts: (districts: District[]) => void;
  setDistrictName: (name: string) => void;
  setSelectedDistrictForDelete: (district: District | null) => void;
  setEditedDistrict: (district: District | null) => void;
  setIsRegionAddModalVisible: (visible: boolean) => void;
  setIsRegionEditModalVisible: (visible: boolean) => void;
  setIsRegionDeleteModalVisible: (visible: boolean) => void;
  setIsDistrictAddModalVisible: (visible: boolean) => void;
  setIsDistrictEditModalVisible: (visible: boolean) => void;
  setIsDistrictDeleteModalVisible: (visible: boolean) => void;
}
