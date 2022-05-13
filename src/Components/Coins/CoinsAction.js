import { Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserCoinAction from "../UserCoins/AddCoin";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteCoin from "../UserCoins/DeleteCoin";
import EditIcon from "@mui/icons-material/Edit";
import Color from "color";
import { greyColor, pinkColor } from "../../Common/Colors";
import { useStoreState } from "easy-peasy";
import { USER_COIN_BY_COIN_ID } from "../../graphql/queries";
import Error from "../Error/CustomError";
import { useEffect, useState } from "react";
import NotificationActions from "../Notification/NotificationActions";
import UserCoinDetails from "./UserCoinDetails";
import { useLazyQuery } from "@apollo/client";

const CoinsAction = ({ coinDetails }) => {
  const userDetails = useStoreState((state) => state.user.userDetails);

  const [openCoinAction, setOpenCoinAction] = useState(false);
  const [openCoinActionMore, setOpenCoinActionMore] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);
  const [userCoinData, setUserCoinData] = useState({});
  const [fetchUserCoin, { data, error, loading }] = useLazyQuery(
    USER_COIN_BY_COIN_ID,
    {
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (!loading && data && data.userCoins && data.userCoins[0]) {
      setUserCoinData({
        ...data.userCoins[0],
      });
    }
  }, [coinDetails, fetchUserCoin, userDetails]);

  if (error) return <Error message={error.message} />;
  if (userDetails && userDetails.id) {
    return (
      <>
        <Divider sx={{ marginBottom: "1em" }} />
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          spacing={1}
        >
          <Typography variant={"h5"} component={"p"}>
            My holdings
          </Typography>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
          >
            <NotificationActions coinId={coinDetails.id} />

            {userCoinData && userCoinData.id ? (
              <>
                <Tooltip title={"Add more holdings"}>
                  <IconButton
                    variant="outlined"
                    color={"success"}
                    onClick={() => {
                      setOpenCoinActionMore(true);
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Edit holdings"}>
                  <IconButton
                    variant="outlined"
                    color={"secondary"}
                    sx={{ color: `${Color(pinkColor).lighten(0.35)}` }}
                    onClick={() => {
                      setOpenCoinAction(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={"Delete holdings"}>
                  <IconButton
                    variant="outlined"
                    color={"error"}
                    onClick={() => {
                      setOpenDelete(true);
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Tooltip title={"Add holdings"}>
                <IconButton
                  variant="outlined"
                  color={"secondary"}
                  sx={{ color: `${Color(pinkColor).lighten(0.35)}` }}
                  onClick={() => {
                    setOpenCoinAction(true);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
        {userCoinData && userCoinData.id ? (
          <Stack
            direction={"row"}
            alignItems={"baseline"}
            spacing={1}
            sx={{ marginTop: "1em" }}
          >
            <UserCoinDetails
              value={
                userCoinData.quantity *
                coinDetails.coins_market_data.currentPrice
              }
              quantity={userCoinData.quantity}
              price={userCoinData.totalPrice}
              profit={
                (coinDetails.coins_market_data.currentPrice -
                  userCoinData.totalPrice) *
                userCoinData.quantity
              }
            />
            {/*<Typography component={"p"} fontWeight={"500"} lineHeight={1}>*/}
            {/*    Quantity :*/}
            {/*</Typography>*/}
            {/*<Typography component={"p"} color={greyColor}>*/}
            {/*    {userCoinData && userCoinData.quantity ? userCoinData.quantity : 0}*/}
            {/*</Typography>*/}
            {/*<Typography component={"p"} fontWeight={"500"} lineHeight={1}>*/}
            {/*    Price :*/}
            {/*</Typography>*/}
            {/*<Typography component={"p"} color={greyColor}>*/}
            {/*    {userCoinData && userCoinData.totalPrice ? `$${userCoinData.totalPrice}` : `$0`}*/}
            {/*</Typography>*/}
          </Stack>
        ) : (
          <Typography component={"p"} color={greyColor}>
            No holdings
          </Typography>
        )}

        <UserCoinAction
          open={openCoinAction}
          setOpen={setOpenCoinAction}
          userCoinData={userCoinData}
          coinId={coinDetails.id}
          setUserCoinData={setUserCoinData}
        />
        <UserCoinAction
          open={openCoinActionMore}
          setOpen={setOpenCoinActionMore}
          userCoinData={{}}
          coinId={coinDetails.id}
          setUserCoinData={setUserCoinData}
        />

        <DeleteCoin
          open={openDelete}
          setOpen={setOpenDelete}
          coinId={coinDetails.id}
          userId={userDetails.id}
          setUserCoinData={setUserCoinData}
        />
      </>
    );
  }
  return null;
};
export default CoinsAction;
