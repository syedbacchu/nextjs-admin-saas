import { useState, useEffect } from "react";
import Select from "react-select";
import {UserService} from "@/services/user.service";
import {ApiListResponse} from "@/types/api";

interface Collaborator {
    value: number;
    label: string;
}
interface UserData {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    image: string | null;
}

interface CollaboratorSelectProps {
    value: any[];
    onChange: (selectedIds: any[]) => void;
}

export default function CollaboratorSelect({ value, onChange }: CollaboratorSelectProps) {
    const [options, setOptions] = useState<Collaborator[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await UserService.collaborators() as unknown as ApiListResponse<UserData>;

                if (response.success && response.data?.data) {
                    const userList = response.data.data;
                    const formattedOptions = userList.map((user) => ({
                        value: user.id,
                        label: user.name
                    }));

                    setOptions(formattedOptions);
                }
            } catch (error) {
                console.error("Failed to load collaborators", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleChange = (selectedOptions: any) => {
        const ids = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];
        onChange(ids);
    };

    // Filter options to show currently selected values
    const currentSelection = options.filter(opt => value.includes(opt.value));

    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">
                Add Collaborators
            </label>
            <Select
                isMulti
                isLoading={isLoading}
                options={options}
                value={currentSelection}
                onChange={handleChange}
                placeholder="Search and select collaborators..."
                className="basic-multi-select"
                classNamePrefix="select"
                // Optional: Enable this if you want the dropdown to close on select
                closeMenuOnSelect={false}
            />
            <p className="text-xs text-gray-500 mt-2">
                Type to search. You can select multiple users.
            </p>
        </div>
    );
}