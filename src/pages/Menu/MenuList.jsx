import { TableComponent } from "../../components/TableComponent/TableComponent";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { API_ROUTES } from "../../utils/api_constants";
import { CreateEditMenuModal } from "./CreateEditMenuModal";
import { useFetch } from "../../utils/hooks/api_hooks";
import { formatAmount } from "../../utils/utils";
import { CommonHeader } from "../../components/common/CommonHeader";
import { InputField } from "../../components/common/InputField";
import { usePatch } from "../../utils/hooks/api_hooks";
import toast from "react-hot-toast";
import { queryClient } from "../../lib/queryClient";
import { Power, PackageCheck, PackageX } from "lucide-react";

export const MenuList = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [status, setStatus] = useState("active");
  const [stockFilter, setStockFilter] = useState("inStock");
  const [patchEndpoint, setPatchEndpoint] = useState(null);

  const { data: { result: { categories: adminCategories = [] } = {} } = {} } =
    useFetch("admin-categories", API_ROUTES.getAdminCategories);

  const { mutate: updateMenuStatus } = usePatch(patchEndpoint, {
    onSuccess: () => {
      toast.success("Menu status updated");
      queryClient.invalidateQueries({
        querykey: ["menu-list", selectedCategory, status, stockFilter],
      });
    },
    onError: () => {
      toast.error("Failed to update menu");
    },
  });

  const handleUpdateMenuStatus = (id, payload) => {
    const endpoint = `${API_ROUTES.updateMenuStatus}/${id}`;
    setPatchEndpoint(endpoint);

    // wait one tick so hook receives new endpoint
    setTimeout(() => {
      updateMenuStatus(payload);
    }, 0);
  };

  const columns = useMemo(
    () => [
      {
        id: "image",
        header: "Image",
        Cell: ({ row }) => (
          <img
            src={row.original.image}
            alt="menu"
            className="w-12 h-12 rounded-lg object-cover"
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Item Name",
      },
      {
        accessorKey: "category",
        header: "Category",
        Cell: ({ row }) => row.original.category || "-",
      },
      {
        accessorKey: "price",
        header: "Price",
        Cell: ({ row }) => `₹ ${formatAmount(row.original.price)}`,
      },
      {
        accessorKey: "discountPrice",
        header: "Discount Price",
        Cell: ({ row }) =>
          row.original.discountPrice
            ? `₹ ${formatAmount(row.original.discountPrice)}`
            : "-",
      },
    ],
    [],
  );

  const actions = useMemo(() => {
    const baseActions = [
      {
        label: "Edit",
        icon: Edit,
        onClick: (row) => {
          setMenuId(row.original._id);
          setOpen(true);
        },
      },
    ];

    const activateAction = {
      label: "Activate",
      icon: Power,
      onClick: (row) =>
        handleUpdateMenuStatus(row.original._id, { isActive: true }),
    };

    const inactiveAction = {
      label: "Inactivate",
      icon: Power,
      onClick: (row) =>
        handleUpdateMenuStatus(row.original._id, { isActive: false }),
    };

    const outOfStockAction = {
      label: "Out Of Stock",
      icon: PackageX,
      onClick: (row) =>
        handleUpdateMenuStatus(row.original._id, { inStock: false }),
    };

    const inStockAction = {
      label: "In Stock",
      icon: PackageCheck,
      onClick: (row) =>
        handleUpdateMenuStatus(row.original._id, { inStock: true }),
    };

    // ACTIVE TAB
    if (status === "active") {
      if (stockFilter === "inStock") {
        return [...baseActions, outOfStockAction, inactiveAction];
      }

      if (stockFilter === "outOfStock") {
        return [...baseActions, inStockAction, inactiveAction];
      }
    }

    // INACTIVE TAB
    if (status === "inactive") {
      return [...baseActions, activateAction];
    }

    return baseActions;
  }, [status, stockFilter]);

  const queryParams = {
    ...(selectedCategory && { category: selectedCategory }),

    isActive: status === "active",

    ...(status === "active" &&
      stockFilter && {
        inStock: stockFilter === "inStock",
      }),
  };

  const categoryOptions = [
    { _id: "", name: "All Categories" },
    ...adminCategories.map((cat) => ({
      _id: cat.name,
      name: cat.name,
    })),
  ];

  const stockOptions = [
    { _id: "inStock", name: "In Stock" },
    { _id: "outOfStock", name: "Out of Stock" },
  ];

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setStockFilter("inStock");
  };

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <CommonHeader
        title="Menu Management"
        buttonText="Create Menu"
        buttonIcon={<Plus size={18} />}
        onButtonClick={() => {
          setMenuId(null);
          setOpen(true);
        }}
      />

      <CreateEditMenuModal
        open={open}
        menuId={menuId}
        onClose={() => {
          setOpen(false);
          setMenuId(null);
        }}
      />

      <Box sx={{ width: "100%", bgcolor: "#FAF7F2", minHeight: "100vh", p: 3 }}>
        <div className="flex items-center gap-6 border-b border-gray-200 mb-4">
          <button
            onClick={() => handleStatusChange("active")}
            className={`pb-2 text-md font-semibold transition
      ${
        status === "active"
          ? "text-[#6F4E37] border-b-2 border-[#6F4E37]"
          : "text-gray-500 hover:text-[#6F4E37]"
      }
    `}
          >
            Active
          </button>

          <button
            onClick={() => handleStatusChange("inactive")}
            className={`pb-2 text-md font-semibold transition
      ${
        status === "inactive"
          ? "text-[#6F4E37] border-b-2 border-[#6F4E37]"
          : "text-gray-500 hover:text-[#6F4E37]"
      }
    `}
          >
            Inactive
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          {/* Category Filter */}
          <div className="w-48">
            <InputField
              isSelect
              field={{ value: selectedCategory }}
              options={categoryOptions}
              onChange={(e) => setSelectedCategory(e.target.value)}
              placeholder="Filter by Category"
            />
          </div>

          {/* Stock Filter only for Active */}
          {status === "active" && (
            <div className="w-48">
              <InputField
                isSelect
                field={{ value: stockFilter }}
                options={stockOptions}
                onChange={(e) => setStockFilter(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Table */}
        <TableComponent
          slug="menu"
          columns={columns}
          actions={actions}
          actionsType="menu"
          // querykey={`menu-list-${selectedCategory}-${status}-${stockFilter}`}
          querykey={["menu-list", selectedCategory, status, stockFilter]}
          params={queryParams}
          getApiEndPoint="menulist"
          enableExportTable={true}
        />
      </Box>
    </div>
  );
};
