import { IconButton, Stack } from "@mui/material";
import React from "react";
import Iconify from "src/components/Iconify";
import Loop from "src/components/loop";

const _data = [
    {
        icon: "icon-park-outline:facebook",
        link: "https://www.facebook.com/cloudmlmsoftware/",
    },
    { icon: "hugeicons:new-twitter", link: "https://x.com/cloudmlmsoft" },
    {
        icon: "akar-icons:instagram-fill",
        link: "https://www.instagram.com/cloudmlmsoftware/",
    },
    {
        icon: "line-md:linkedin",
        link: "https://in.linkedin.com/company/cloudmlmsoftware",
    },
];

const Icons = ({ mt = 5, color = "#fff", mb = 0 }) => {
    return (
        <Stack direction="row" marginTop={mt}>
            <Loop
                list={_data}
                render={({ icon, link }) => (
                    <IconButton
                        LinkComponent="a"
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        sx={{
                            mb: mb,
                        }}
                    >
                        <Iconify
                            icon={icon}
                            sx={{
                                color: color,
                                fontSize: "0.9rem",
                            }}
                        />
                    </IconButton>
                )}
            />
        </Stack>
    );
};

export default Icons;
