import UsersDataService from "@/services/UsersDataService";

const ImageListComponent: React.FC = async () => {
  const service = new UsersDataService()
  const usersList = await service.findAll(1)

  return (
    <div>
      ImageListComponent

      {usersList && usersList.map(user => (<p key={user.id} >User {JSON.stringify(user)}</p>))}
    </div>
  )
}

export default ImageListComponent
