import React, { useEffect } from "react";
import { Modal, Space, Input, Table, Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import { fetchData } from "../../Global/GlobalGetFucn";
import { deleteResource } from "../../Global/GlobalDeleteFunc";
import useAddressStore from "../../store/adressStore";
import { MdDelete, MdEdit, MdOutlineAddCircle } from "react-icons/md";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Region: React.FC = () => {
  const {
    regions,
    regionName,
    editedRegion,
    isRegionAddModalVisible,
    isRegionEditModalVisible,
    isRegionDeleteModalVisible,
    setRegions,
    setRegionName,
    setEditedRegion,
    setIsRegionAddModalVisible,
    setIsRegionEditModalVisible,
    setIsRegionDeleteModalVisible,
  } = useAddressStore();

  const token = sessionStorage.getItem("token");

  // Fetch Regions
  const fetchRegions = async () => {
    try {
      const data = await fetchData("region", token || "");
      setRegions(data);
    } catch (error) {
      toast.error("Error fetching regions.");
      console.error(error);
    }
  };

  // Add Region
  const addRegion = async () => {
    if (!regionName) {
      toast.warn("Please enter a region name.");
      return;
    }
    try {
      const response = await axios.post(
        "http://142.93.106.195:9090/region",
        { name: regionName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Region added successfully.");
        fetchRegions();
        setRegionName("");
        setIsRegionAddModalVisible(false); // Close modal after successful addition
      } else {
        toast.error("Failed to add region.");
      }
    } catch (error) {
      toast.error("Error adding region.");
      console.error(error);
    }
  };

  // Edit Region
  const handleEditRegion = async () => {
    if (!editedRegion) {
      toast.warn("Please select a region to edit.");
      return;
    }

    try {
      const response = await axios.put(
        `http://142.93.106.195:9090/region/${editedRegion.id}`,
        { name: regionName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Region updated successfully.");
        fetchRegions();
      } else {
        toast.error("Failed to update region.");
      }
    } catch (error) {
      toast.error("Error updating region.");
      console.error(error);
    }
    setIsRegionEditModalVisible(false); // Close modal after editing
  };

  // Delete Region
  const handleDeleteRegion = async () => {
    if (!editedRegion) {
      toast.warn("Please select a region to delete.");
      return;
    }

    try {
      const success = await deleteResource(editedRegion.id, "region", token);
      if (success) {
        toast.success("Region deleted successfully.");
        fetchRegions();
      } else {
        toast.error("Failed to delete region.");
      }
    } catch (error) {
      toast.error("Error deleting region.");
      console.error(error);
    }

    setIsRegionDeleteModalVisible(false); // Close modal after deletion
  };

  // Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Region Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setEditedRegion(record); // Track the region to edit
              setRegionName(record.name); // Set the region name in the modal
              setIsRegionEditModalVisible(true); // Open edit modal
            }}
            style={{
              // bg-gray-600
              color: "black",
              border: "none",
              cursor: "pointer",
              boxShadow: "none",
              background: "none"
            }}
          >
            <MdEdit className="hover:text-yellow-600" />
          </Button>
          <Button
            onClick={() => {
              setEditedRegion(record); // Track the region to delete
              setIsRegionDeleteModalVisible(true); // Open delete modal
            }}
            style={{
              // bg-gray-600
              color: "black",
              border: "none",
              cursor: "pointer",
              boxShadow: "none",
              background: "none"
            }}
          >
            <MdDelete className="hover:text-red-600" />
          </Button>
        </Space>
      ),
    },
  ];

  // Fetch regions on component mount
  useEffect(() => {
    fetchRegions();
  }, [token]);

  return (
    <div>
      <h1 className="font-bold pb-3">Вилоятлар</h1>
      <Button
  type="default"
  onClick={() => setIsRegionAddModalVisible(true)} // Open add region modal
  style={{
    backgroundColor: "#4B5563", // bg-gray-600
    color: "white",
    border: "none",
    cursor: "pointer",
    marginBottom: "10px",
    display: "inline-flex", // Inline flex
    alignItems: "center", // Vertikal markazlash
    justifyContent: "center", // Gorizontal markazlash
    padding: "8px 16px", // Kichik bo'shliq
  }}
  className="pb-8"
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#374151")} // bg-gray-700
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B5563")} // bg-gray-600
>
  <span style={{ verticalAlign: "middle", display:'flex', justifyContent:'center', alignItems:'center', gap:"5px" }}>  
  <MdOutlineAddCircle style={{ width:"20px", height:"20px" }} />
    
     Қўшиш</span>
</Button>




      <Table
        dataSource={regions}
        columns={columns}
        rowKey="id"
        pagination={false}
      />

      {/* Add Region Modal */}
      <Modal
        title="Add New Region"
        open={isRegionAddModalVisible}
        onOk={addRegion}
        onCancel={() => setIsRegionAddModalVisible(false)}
        okText="Add"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter region name"
          value={regionName}
          onChange={(e) => setRegionName(e.target.value)}
          className="mb-4"
        />
      </Modal>

      {/* Edit Region Modal */}
      <Modal
        title="Edit Region"
        open={isRegionEditModalVisible}
        onOk={handleEditRegion}
        onCancel={() => setIsRegionEditModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          placeholder="Enter region name"
          value={regionName}
          onChange={(e) => setRegionName(e.target.value)}
          className="mb-4"
        />
      </Modal>

      {/* Delete Region Modal */}
      <Modal
        title="Confirm Deletion"
        open={isRegionDeleteModalVisible}
        onOk={handleDeleteRegion}
        onCancel={() => setIsRegionDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this region?</p>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Region;
