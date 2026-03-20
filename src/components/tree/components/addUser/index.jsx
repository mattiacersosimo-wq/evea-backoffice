import { Dialog, DialogContent, DialogTitle, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { PLANS } from "src/CONSTANTS";
import { HideFromAdmin, HideFromUser } from "src/components/role-helpers";
import ShowForPlan from "src/components/show-for-plan";
import TabPanel from "src/components/tab-panel";
import Transition from "src/utils/dialog-animation.js";
import AddForm from "./components/add-form";
import HoldingForm from "./components/holding-form";

const { binary, ...rest } = PLANS;

const AddUser = ({ onClose, addUser, fetchTreeData }) => {
    const [currentTab, setCurrentTab] = useState("register");

    return (
        <Dialog
            open={addUser.status}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            TransitionComponent={Transition}
        >
            <DialogTitle>
                <ShowForPlan types={[binary]}>
                    <HideFromAdmin>
                        <Tabs
                            aria-label="basic tabs example"
                            value={currentTab}
                            onChange={(_, v) => setCurrentTab(v)}
                        >
                            <Tab value="register" label="Add User" />
                            <Tab value="holding" label="Holding Tank" />
                        </Tabs>
                    </HideFromAdmin>
                    <HideFromUser>Add User</HideFromUser>
                </ShowForPlan>
                <ShowForPlan types={Object.values(rest)}>Add User</ShowForPlan>
            </DialogTitle>

            <ShowForPlan types={[binary]}>
                <HideFromAdmin>
                    <TabPanel name="register" value={currentTab}>
                        <AddForm
                            addUser={addUser}
                            onClose={onClose}
                            fetchTreeData={fetchTreeData}
                        />
                    </TabPanel>

                    <TabPanel name="holding" value={currentTab}>
                        <DialogContent>
                            <HoldingForm
                                addUser={addUser}
                                onClose={onClose}
                                fetchTreeData={fetchTreeData}
                            />
                        </DialogContent>
                    </TabPanel>
                </HideFromAdmin>
                <HideFromUser>
                    <AddForm
                        addUser={addUser}
                        onClose={onClose}
                        fetchTreeData={fetchTreeData}
                    />
                </HideFromUser>
            </ShowForPlan>
            <ShowForPlan types={Object.values(rest)}>
                <AddForm
                    addUser={addUser}
                    onClose={onClose}
                    fetchTreeData={fetchTreeData}
                />
            </ShowForPlan>
        </Dialog>
    );
};

export default AddUser;
