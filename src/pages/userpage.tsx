import { Input, Select, DatePicker, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserProfile } from '../api/api';

const { Option } = Select;

function Userpage() {
    const [data, setData] = useState<any[]>([]); // Viloyat ma'lumotlarini saqlash

    useEffect(() => {
        const fetchData = async () => {
            let token = sessionStorage.getItem('token')
            try {
                const response = await axios.get(UserProfile, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Tokenni sarlavha sifatida qo'shish
                    },
                });
                setData(response.data.body); // Faqat bir marta ma'lumotni o'rnatish
                console.log(response.data); // Javobni konsolda tekshiring
            } catch (e: any) {
                console.error('Error fetching regions:', e.message);
            }
        };
        fetchData();
    }, []); // Bo'sh array - faqat bir marta ishlaydi

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
                        {/* Chap ustun */}
                        <div className="w-[50%] h-[400px] flex flex-col justify-center items-center gap-10">
                            <Input placeholder="Ism" style={{ width: '70%', height: '50px' }} />
                            {/* <Select */}
                                {/* placeholder="Viloyat"
                                style={{ width: '70%', height: '50px' }}
                            > */}
                                {Array.isArray(data) && data.map((region: any) => (
                                    <li style={{color:'black'}} key={region.id} value={region.id}>
                                        {region.fullName || "salom"}
                                    </li>
                                ))}

                            {/* </Select> */}
                            <Input placeholder="E-pochta" style={{ width: '70%', height: '50px' }} />
                            <Input placeholder="Telefon raqam" style={{ width: '70%', height: '50px' }} />
                        </div>

                        {/* O'ng ustun */}
                        <div className="w-[50%] h-[400px] flex flex-col justify-center items-center gap-10">
                            <Input placeholder="Familya" style={{ width: '70%', height: '50px' }} />
                            <Select
                                placeholder="Tuman"
                                style={{ width: '70%', height: '50px' }}
                            >
                                <Option disabled>Tumanlar topilmadi</Option>
                            </Select>
                            <Input placeholder="Kocha" style={{ width: '70%', height: '50px' }} />
                            <DatePicker placeholder="Tug'ilgan sana" style={{ width: '70%', height: '50px' }} />
                        </div>
                    </div>
                    <Button className="ml-[120px]">O'zgarishlarni saqlash</Button>
                </div>
            </div>
        </div>
    );
}

export default Userpage;
