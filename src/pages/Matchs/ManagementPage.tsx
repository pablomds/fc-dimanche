import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { deleteMatch, getMatch } from "../../controllers/matchControllers";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { MdFolderOff } from "react-icons/md";
import { utils } from "../../utils/utils";
import PageLoader from "../../components/Loader/PageLoader";
import Card from '../../components/Card';
import { MatchVM } from "../../viewModels/MatchVM";
import _ from "lodash";
import Table from '../../components/Table';
import Button from '../../components/Buttons/Button';
import DeleteModal from '../../components/Modal/DeleteModal';

const ManagementPage = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMatchDeleted, setIsMatchDeleted] = useState<boolean>(false);
  const [isMatchFound, setIsMatchFound] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [matchVM, setMatchVM] = useState<MatchVM>();
  const { id } = useParams();

  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (!id || !utils.isValidFirestoreId(id)) {
          setIsMatchFound(false);
          return;
        }

        const match = await getMatch(id);

        if (!match) {
          setIsMatchFound(false);
          return
        }

        setMatchVM(MatchVM.fromMatch(match))
      } catch (error) {
        console.log('Error ', error);
      } finally {
        setTimeout(() => setIsLoading(false), 1000)
      }
    };

    fetchData()
  }, [id]);


  const MatchFound = () => (
    <>
      <h1 className="text-center font-semibold text-2xl lg:text-4xl select-none">
        Gérer mon match
      </h1>
      <div>
        <h2 className="text-xl lg:text-2xl mt-2 mb-2 select-none font-semibold">
          Invitations -{" "}
          {matchVM?.invitedPlayers.length
            ? `${matchVM?.invitedPlayers.length} ${
                matchVM?.invitedPlayers.length > 1 ? "joueurs" : "joueurs"
              } `
            : "0 joueurs actuellement"}
        </h2>
        <div className="max-h-72 min-h-48 overflow-auto custom-scroll my-4">
          {playersRows().length ? (
            <Table
              columns={[
                { label: "Nom", key: "name" },
                { label: "Status", key: "status" },
              ]}
              defaultOrder="desc"
              defaultSortKey="status"
              rows={playersRows()}
            />
          ) : (
            <div>Aucun joueur n'est actuellement enregistré.</div>
          )}
        </div>
      </div>
      {matchVM && (
        <DeleteModal
          matchVM={matchVM}
          onDelete={onDeleteMatch}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
      <div className="flex flex-col justify-center items-center space-y-4 w-full md:mt-8">
        <div className="w-full flex items-center justify-center">
          <Button
            onClick={inviteOtherPlayers}
            isDisabled={true}
            className="bg-gradient-to-r from-[#3B7214] via-[#5B8E2A] to-[#7AAB40] text-[#FFFFFF] p-4 h-14 w-full md:w-72 md:h-16"
            buttonText="Inviter des amis"
          />
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-[#FF6868] text-[#FFFFFF] p-4 h-14 w-full md:w-72 md:h-16"
            buttonText="Supprimer le match"
          />
        </div>
      </div>
    </>
  );

  const MatchNotFound = () => (
    <div>
      <div className="flex justify-center items-center mb-4 mt-4 md:mt-8 md:mb-8 lg:mt-16 lg:mb-16">
        <MdFolderOff className="w-48 h-48 md:h-56 md:w-56 lg:h-72 lg:w-72 text-[#04100D]" />
      </div>
      <div className="flex flex-col justify-center items-center space-y-4">
        <h1 className="text-xl lg:text-2xl font-semibold text-center">
          Oups ! Il n'y a aucun résultat dans notre base de données.
        </h1>
      <div className="mt-8 mb-6">
        <Link
          to="/match/creation"
          className="flex justify-center drop-shadow-2xl rounded-full p-4 w-60 h-14 text-base text-[#FFFFFF] bg-gradient-to-r from-[#3B7214] via-[#5B8E2A] to-[#7AAB40] font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
        >
          Créer le match
        </Link>
      </div>
      </div>
    </div>
  );

  const MatchDeleted = () => (
    <div>
      <div className="flex justify-center items-center mb-4 mt-4 md:mt-8 md:mb-8 lg:mt-16 lg:mb-16">
        <RiDeleteBin2Fill className="w-48 h-48 md:h-56 md:w-56 lg:h-72 lg:w-72 text-[#04100D]" />
      </div>
      <div className="flex flex-col justify-center items-center space-y-4">
        <h1 className="text-xl lg:text-2xl font-semibold text-center">
          Ce match a bien été supprimé.
        </h1>
        <div className="mt-8 mb-6">
          <Link
            to="/match/creation"
            className="flex justify-center drop-shadow-2xl rounded-full p-4 w-60 h-14 text-base text-[#FFFFFF] bg-gradient-to-r from-[#3B7214] via-[#5B8E2A] to-[#7AAB40] font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
          >
            Créer un match
          </Link>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  const inviteOtherPlayers = () => {
    console.log('Invite friends is not available.')
  };

  const onDeleteMatch = async () => {
    setIsDeleteModalOpen(false);
    setIsMatchDeleted(true);
    if (!id) return
    await deleteMatch(id);
  }

  const playersRows = () => {
    return _.map(matchVM?.invitedPlayers, player => {
      return {
        name: {
          value: player.name
        },
        status: {
          value: MatchVM.getInvitedPlayerColor(player.willBePresent).tagText,
          isTag: true,
          tag: {
            textColor: MatchVM.getInvitedPlayerColor(player.willBePresent).tagTextColor,
            backgroundColor: MatchVM.getInvitedPlayerColor(player.willBePresent).tagBackgroundColor,
            text: MatchVM.getInvitedPlayerColor(player.willBePresent).tagText
          }
        }
      }
    })
  };

  return (
    <section className="bg-cover bg-center lg:bg-img-match-creation bg-img-match-confirmation-mobile h-screen w-screen overflow-y-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center px-2 lg:px-0">
        <Card className="py-2 px-1">
          {
            (matchVM && !isMatchDeleted && isMatchFound) && <MatchFound/>
          }
          {
            !isMatchFound && <MatchNotFound />
          }
          {
            isMatchDeleted && <MatchDeleted />
          }
        </Card>
      </div>
    </section>
  );
}

export default ManagementPage;