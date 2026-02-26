// import { useState } from "react";
// import dayjs from "dayjs";
// import {
//   Button,
//   Menu,
//   Box,
//   List,
//   ListItem,
//   Chip,
//   Tooltip,
//   IconButton,
//   Divider,
//   Typography,
// } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
// import RestartAltIcon from "@mui/icons-material/RestartAlt";

// const THEME_COLOR = "#6F4E37";

// const shortcuts = [
//   {
//     label: "Today",
//     getRange: () => [dayjs(), dayjs()],
//   },
//   {
//     label: "Yesterday",
//     getRange: () => [
//       dayjs().subtract(1, "day"),
//       dayjs().subtract(1, "day"),
//     ],
//   },
//   {
//     label: "Last 7 Days",
//     getRange: () => [dayjs().subtract(6, "day"), dayjs()],
//   },
//   {
//     label: "This Month",
//     getRange: () => [
//       dayjs().startOf("month"),
//       dayjs().endOf("month"),
//     ],
//   },
//   {
//     label: "Custom Range",
//     getRange: () => [null, null],
//   },
// ];

// export default function DateRangeFilter({ onChange }) {
//   const [anchorEl, setAnchorEl] = useState(null);

//   // Applied values
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   // Temporary values
//   const [tempStart, setTempStart] = useState(null);
//   const [tempEnd, setTempEnd] = useState(null);

//   const handleApply = () => {
//     const finalStart = tempStart;
//     const finalEnd = tempEnd || tempStart; // 👈 single date support

//     setStartDate(finalStart);
//     setEndDate(finalEnd);

//     onChange({
//       startDate: finalStart?.format("YYYY-MM-DD"),
//       endDate: finalEnd?.format("YYYY-MM-DD"),
//     });

//     setAnchorEl(null);
//   };

//   const handleCancel = () => {
//     setTempStart(startDate);
//     setTempEnd(endDate);
//     setAnchorEl(null);
//   };

//   const handleReset = () => {
//     setStartDate(null);
//     setEndDate(null);
//     setTempStart(null);
//     setTempEnd(null);
//     onChange({ startDate: null, endDate: null });
//   };

//   const buttonLabel =
//     startDate && endDate
//       ? `${startDate.format("MMM DD, YYYY")} - ${endDate.format(
//         "MMM DD, YYYY"
//       )}`
//       : "Start Date - End Date";

//   return (
//     <Box display="flex" alignItems="center" gap={1}>
//       <Tooltip title="Reset date range">
//         <IconButton
//           size="small"
//           onClick={handleReset}
//           sx={{
//             border: "1px solid",
//             borderColor: THEME_COLOR,
//             color: THEME_COLOR,
//           }}
//         >
//           <RestartAltIcon fontSize="small" />
//         </IconButton>
//       </Tooltip>

//       <Button
//         variant="outlined"
//         onClick={(e) => {
//           setTempStart(startDate);
//           setTempEnd(endDate);
//           setAnchorEl(e.currentTarget);
//         }}
//         sx={{
//           borderColor: THEME_COLOR,
//           color: THEME_COLOR,
//           textTransform: "none",
//         }}
//       >
//         {buttonLabel}
//       </Button>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleCancel}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//       >
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <Box display="flex">
//             {/* Shortcuts */}
//             <Box sx={{ width: 180, borderRight: "1px solid #eee", p: 2 }}>
//               <List dense>
//                 {shortcuts.map((item) => (
//                   <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
//                     <Chip
//                       label={item.label}
//                       size="small"
//                       sx={{
//                         width: "100%",
//                         justifyContent: "flex-start",
//                         bgcolor: `${THEME_COLOR}10`,
//                       }}
//                       onClick={() => {
//                         const [s, e] = item.getRange();
//                         setTempStart(s);
//                         setTempEnd(e);
//                       }}
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </Box>

//             {/* Calendars */}
//             <Box px={1}
//               py={1}
//               display="flex"
//               gap={1}
//             >
//               <StaticDatePicker
//                 value={tempStart}
//                 onChange={(val) => setTempStart(val)}
//                 // slots={{ actionBar: () => null }}
//                 slots={{
//                   toolbar: null,      // ✅ removes "SELECT DATE"
//                   actionBar: null,    // ✅ removes bottom buttons
//                 }}
//                 sx={{
//                   width: 280,
//                   "& .MuiPickersDay-root": {
//                     width: 36,
//                     height: 36,
//                     fontSize: 13,
//                   },
//                   "& .MuiDayCalendar-weekDayLabel": {
//                     width: 36,
//                     height: 36,
//                   },
//                 }}
//               />

//               <StaticDatePicker
//                 value={tempEnd}
//                 minDate={tempStart}
//                 onChange={(val) => setTempEnd(val)}
//                 // slots={{ actionBar: () => null }}
//                 slots={{
//                   toolbar: null,      // ✅ removes "SELECT DATE"
//                   actionBar: null,    // ✅ removes bottom buttons
//                 }}
//                 sx={{
//                   width: 280,
//                   "& .MuiPickersDay-root": {
//                     width: 36,
//                     height: 36,
//                     fontSize: 13,
//                   },
//                   "& .MuiDayCalendar-weekDayLabel": {
//                     width: 36,
//                     height: 36,
//                   },
//                 }}
//               />
//             </Box>
//           </Box>

//           {/* Footer */}
//           <Divider />
//           <Box
//             px={2}
//             py={1}
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="body2">
//               {tempStart &&
//                 `${tempStart.format("MM/DD/YYYY")} - ${(tempEnd || tempStart).format("MM/DD/YYYY")
//                 }`}
//             </Typography>

//             <Box display="flex" gap={1}>
//               <Button size="small" onClick={handleCancel}>
//                 Cancel
//               </Button>
//               <Button
//                 size="small"
//                 variant="contained"
//                 onClick={handleApply}
//                 sx={{ bgcolor: THEME_COLOR }}
//               >
//                 Apply
//               </Button>
//             </Box>
//           </Box>
//         </LocalizationProvider>
//       </Menu>
//     </Box>
//   );
// }

import { useState } from "react";
import dayjs from "dayjs";
import {
  Button,
  Menu,
  Box,
  List,
  ListItem,
  Chip,
  Tooltip,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

const THEME_COLOR = "#6F4E37";

const shortcuts = [
  { label: "Today", getRange: () => [dayjs(), dayjs()] },
  {
    label: "Yesterday",
    getRange: () => [
      dayjs().subtract(1, "day"),
      dayjs().subtract(1, "day"),
    ],
  },
  {
    label: "Last 7 Days",
    getRange: () => [dayjs().subtract(6, "day"), dayjs()],
  },
  {
    label: "This Month",
    getRange: () => [
      dayjs().startOf("month"),
      dayjs().endOf("month"),
    ],
  },
  { label: "Custom Range", getRange: () => [null, null] },
];

const calendarSx = {
  width: 240,
  "& .MuiPickersDay-root": {
    width: 32,
    height: 32,
    fontSize: 12,
  },
  "& .MuiDayCalendar-weekDayLabel": {
    width: 32,
    height: 32,
    fontSize: 11,
  },
  "& .MuiPickersCalendarHeader-root": {
    minHeight: 36,
  },
};

export default function DateRangeFilter({ onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // Applied values
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Temp values
  const [tempStart, setTempStart] = useState(null);
  const [tempEnd, setTempEnd] = useState(null);

  const handleApply = () => {
    const finalStart = tempStart;
    const finalEnd = tempEnd || tempStart;

    setStartDate(finalStart);
    setEndDate(finalEnd);

    onChange({
      startDate: finalStart ? finalStart.format("YYYY-MM-DD") : null,
      endDate: finalEnd ? finalEnd.format("YYYY-MM-DD") : null,
    });

    setAnchorEl(null);
  };

  const handleCancel = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setAnchorEl(null);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setTempStart(null);
    setTempEnd(null);
    onChange({ startDate: null, endDate: null });
  };

  const buttonLabel =
    startDate && endDate
      ? `${startDate.format("MMM DD, YYYY")} - ${endDate.format(
        "MMM DD, YYYY"
      )}`
      : "Start Date - End Date";

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Reset */}
      <Tooltip title="Reset date range">
        <IconButton
          size="small"
          onClick={handleReset}
          sx={{
            border: "1px solid",
            borderColor: THEME_COLOR,
            color: THEME_COLOR,
          }}
        >
          <RestartAltIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Trigger */}
      <Button
        variant="outlined"
        onClick={(e) => {
          setTempStart(startDate);
          setTempEnd(endDate);
          setAnchorEl(e.currentTarget);
        }}
        sx={{
          borderColor: THEME_COLOR,
          color: THEME_COLOR,
          textTransform: "none",
        }}
      >
        {buttonLabel}
      </Button>

      {/* Popup */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCancel}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex">
            {/* Shortcuts */}
            <Box sx={{ width: 180, borderRight: "1px solid #eee", p: 2 }}>
              <List dense>
                {shortcuts.map((item) => (
                  <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                    <Chip
                      label={item.label}
                      size="small"
                      sx={{
                        width: "100%",
                        justifyContent: "flex-start",
                        bgcolor: `${THEME_COLOR}10`,
                      }}
                      onClick={() => {
                        const [s, e] = item.getRange();
                        setTempStart(s);
                        setTempEnd(e);
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Calendars */}
            <Box px={1} py={1} display="flex" gap={2}>
              {/* Start Date */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body2" fontWeight={500} mb={1}>
                  {tempStart ? tempStart.format("DD MMM YYYY") : "—"}
                </Typography>

                <StaticDatePicker
                  value={tempStart}
                  onChange={(val) => {
                    setTempStart(val);
                    if (!tempEnd) setTempEnd(val);
                  }}
                  slots={{
                    toolbar: null,      // ✅ removes "SELECT DATE"
                  }}
                  slotProps={{
                    actionBar: { actions: [] }, // ✅ removes OK / CANCEL
                  }}
                  sx={calendarSx}
                />
              </Box>

              {/* End Date */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body2" fontWeight={500} mb={1}>
                  {tempEnd ? tempEnd.format("DD MMM YYYY") : "—"}
                </Typography>

                <StaticDatePicker
                  value={tempEnd}
                  minDate={tempStart || undefined}
                  onChange={(val) => setTempEnd(val)}
                  slots={{
                    toolbar: null,      // ✅ removes "SELECT DATE"

                  }}
                  slotProps={{
                    actionBar: { actions: [] }, // ✅ removes OK / CANCEL
                  }}
                  sx={calendarSx}
                />
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Divider />
          <Box
            px={2}
            py={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2">
              {tempStart &&
                `${tempStart.format("MM/DD/YYYY")} - ${(tempEnd || tempStart).format(
                  "MM/DD/YYYY"
                )}`}
            </Typography>

            <Box display="flex" gap={1}>
              <Button size="small" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleApply}
                sx={{ bgcolor: THEME_COLOR }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Menu>
    </Box>
  );
}