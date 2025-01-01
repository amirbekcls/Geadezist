import { Input, Select, DatePicker, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import useAddressStore from '../store/adressStore';
import { District, Region } from '../types/adressstype';

const { Option } = Select;

function Userpage() {
    const { regions, districts } = useAddressStore(); 
    const [selectedRegion, setSelectedRegion] = useState<string | null >(null);
    const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

    const handleRegionChange = (value: string ) => {
        setSelectedRegion(value);
        const filtered = districts.filter((district) => district.regionId === value);
        setFilteredDistricts(filtered); 
    };

    return (
        <div>
            <div className="flex flex-col gap-5">
                <div className="user_top bg-white border-1 border-black w-[100%] h-[300px] flex justify-center items-center">
                    <img
                        className="border-2 border-black rounded-full"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEX///+nxBvIAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC"
                        alt="rasm yuq"
                    />
                </div>
                <div className="user_bottom bg-white border-1 border-black w-[100%] h-[500px]">
                    <div className="w-[100%] flex">
                        {/* Left Column */}
                        <div className="w-[50%] h-[400px] flex flex-col justify-center items-center gap-10">
                            <Input placeholder="Ism" style={{ width: '70%', height: '50px' }} />
                            <Select
                                placeholder="Viloyat"
                                style={{ width: '70%', height: '50px' }}
                                onChange={handleRegionChange}
                            >
                                {regions.map((region: Region) => (
                                    <Option key={region.id} value={region.id}>
                                        {region.name}
                                    </Option>
                                ))}
                            </Select>
                            <Input placeholder="E-pochta" style={{ width: '70%', height: '50px' }} />
                            <Input placeholder="Telefon raqam" style={{ width: '70%', height: '50px' }} />
                            
                        </div>

                        <div className="w-[50%] h-[400px] flex flex-col justify-center items-center gap-10">
                            <Input placeholder="Familya" style={{ width: '70%', height: '50px' }} />
                            <Select
                                placeholder="Tuman"
                                style={{ width: '70%', height: '50px' }}
                            >
                                {filteredDistricts.map((district: District) => (
                                    <Option key={district.id} value={district.id}>
                                        {district.name}
                                    </Option>
                                ))}
                            </Select>
                            <Input placeholder="Kocha" style={{ width: '70%', height: '50px' }} />
                            <DatePicker placeholder="Tug'ilgan sana" style={{ width: '70%', height: '50px' }} />
                        </div>
                    </div>
                    <Button className='ml-[120px] ' > uzgarishlarni saqlash</Button>


                </div>
            </div>
        </div>
    );
}

export default Userpage;
