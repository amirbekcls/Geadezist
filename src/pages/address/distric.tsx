import { useEffect } from "react";
import { Modal, Space, Input, Select, Table, Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { deleteResource } from "../../Global/GlobalDeleteFunc"; // Import delete function
import { fetchData } from "../../Global/GlobalGetFucn"; // Import get function
import useAddressStore from "../../store/adressStore"; // Import store
import "react-toastify/dist/ReactToastify.css";
import { Region } from "../../types/adressstype";
import { MdDelete, MdEdit, MdOutlineAddCircle } from "react-icons/md";
import axios from "axios";

const { Option } = Select;

const DistrictPage: React.FC = () => {
    const {
        districts,
        regions,
        districtName,
        selectedRegionId,
        editedDistrict,
        isDistrictAddModalVisible,
        isDistrictEditModalVisible,
        isDistrictDeleteModalVisible,
        setDistricts,
        setRegions,
        setDistrictName,
        setSelectedRegionId,
        setEditedDistrict,
        setIsDistrictAddModalVisible,
        setIsDistrictEditModalVisible,
        setIsDistrictDeleteModalVisible,
    } = useAddressStore();

    const token = sessionStorage.getItem("token");

    // Function to fetch data and update state
    const fetchDataAndSetState = async () => {
        if (!token) {
            toast.error("Token yuq.");
            return;
        }

        try {
            const districtData = await fetchData("district", token);
            setDistricts(districtData);

            const regionData = await fetchData("region", token);
            setRegions(regionData);
        } catch (error) {
            toast.error("Error fetching data.");
            console.error(error);
        }
    };


    const addDistrict = async () => {
        if (!districtName || selectedRegionId === null) {
            toast.warn("Please enter a district name and select a region.");
            return;
        }

        try {
            const response = await axios.post(
                "http://142.93.106.195:9090/district",
                { name: districtName, regionId: selectedRegionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("District added successfully.");
                fetchDataAndSetState();
                setDistrictName("");
                setSelectedRegionId(null);
                setIsDistrictAddModalVisible(false); // Close modal after successful addition
            } else {
                toast.error("Failed to add district.");
            }
        } catch (err) {
            toast.error("Error adding district.");
            console.error(err);
        }
    };

    // Inside DistrictPage
    const handleDeleteDistrict = async () => {
        if (editedDistrict && token) {
            // Pass the arguments in the correct order: id first, resourceType second
            const success = await deleteResource(editedDistrict.id, "district", token);
            if (success) {
                fetchDataAndSetState(); // Refresh the data after successful deletion
                setIsDistrictDeleteModalVisible(false); // Close modal after deleting
            }
        }
    };

    const columns = [
        {
            title: "Т/Р",   
            dataIndex: "id",
            key: "id",
        },
        {
            title: " Туман номи",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Вилоят номи",
            dataIndex: "regionName",
            key: "regionName",
        },
        {
            title: "Ҳаракат",
            key: "action",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button
                        onClick={() => {
                            setEditedDistrict(record);
                            setDistrictName(record.name);
                            setSelectedRegionId(record.regionId);
                            setIsDistrictEditModalVisible(true); // Open edit modal
                        }}
                        type="default"
                        style={{
                             // bg-gray-600
                            color: "black",
                            border: "none",
                            cursor: "pointer",
                            boxShadow:"none"
                        }}
                        // onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#374151")} // bg-gray-700
                        // onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B5563")} // bg-gray-60
                    >
                        <MdEdit />
                    </Button>
                    <Button
                        onClick={() => {
                            setEditedDistrict(record); // Set the district to be deleted
                            setIsDistrictDeleteModalVisible(true); // Open delete modal
                        }}
                        style={{
                            // bg-gray-600
                           color: "black",
                           border: "none",
                           cursor: "pointer",
                           boxShadow:"none"
                       }}
                    >
                        {/* Delete */}
                        <MdDelete />
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetchDataAndSetState();
    }, [token]); // Refetch data when token changes

    return (
        <div>
            <h1 className="font-bold py-3 ">Туман</h1>
            <Button
                onClick={() => setIsDistrictAddModalVisible(true)} // Open add district modal
                style={{
                    backgroundColor: "#4B5563", // bg-gray-600
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    marginBottom:"10px"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#374151")} // bg-gray-700
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B5563")} // bg-gray-600
            >
                <span className="text-2xl text-white">
                    <MdOutlineAddCircle />
                </span>{" "}
                Қўшиш
            </Button>

            <Table
                dataSource={districts}
                columns={columns}
                rowKey="id"
                pagination={false}
            />

            {/* Add District Modal */}
            <Modal
                title="Add New District"
                open={isDistrictAddModalVisible}
                onOk={addDistrict}
                onCancel={() => setIsDistrictAddModalVisible(false)}
                okText="Add"
                cancelText="Cancel"
            >
                <Input
                    placeholder="Enter district name"
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                    className="mb-4"
                />
                <Select
                    placeholder="Select Region"
                    value={selectedRegionId}
                    onChange={(value) => setSelectedRegionId(value)}
                    className="w-full"
                >
                    {regions.map((region: Region) => (
                        <Option key={region.id} value={region.id}>
                            {region.name}
                        </Option>
                    ))}
                </Select>
            </Modal>

            {/* Edit District Modal */}
            <Modal
                title="Edit District"
                open={isDistrictEditModalVisible}
                onOk={addDistrict} // You can create a separate edit function
                onCancel={() => setIsDistrictEditModalVisible(false)}
                okText="Save"
                cancelText="Cancel"
            >
                <Input
                    placeholder="Enter district name"
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                    className="mb-4"
                />
                <Select
                    placeholder="Select Region"
                    value={selectedRegionId}
                    onChange={(value) => setSelectedRegionId(value)}
                    className="w-full"
                >
                    {regions.map((region: Region) => (
                        <Option key={region.id} value={region.id}>
                            {region.name}
                        </Option>
                    ))}
                </Select>
            </Modal>

            {/* Delete District Modal */}
            <Modal
                title="Confirm Deletion"
                open={isDistrictDeleteModalVisible}
                onOk={handleDeleteDistrict} // Call delete handler
                onCancel={() => setIsDistrictDeleteModalVisible(false)}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this district?</p>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default DistrictPage;
