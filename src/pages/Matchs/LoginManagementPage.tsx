import Card from '../../components/Card';
import { useForm, Controller } from 'react-hook-form';
import { object, string, number, date, InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SubmitButton  from '../../components/Buttons/SubmitButton'
import { getMatchWithEmailAndKeyAccess } from '../../controllers/matchControllers';
import { signInUserAnonymously } from '../../database/auth';
import { useNavigate } from 'react-router-dom';

const LoginManagementPage = () => {

  const matchManagementSchema = object({
    email: string().required('Un email est requis').email(),
    accessKey: string().required('Le code doit contenir 10 lettres').length(10)
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: yupResolver(matchManagementSchema),
    defaultValues: {},
  });

  type formValues = InferType<typeof matchManagementSchema>;

  const signInAnonymouslyHandler = async () => {
    try {
      await signInUserAnonymously();
      console.log("Signed in anonymously!");
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    }
  };

  const onSubmit = async (data: formValues) => {

    try {

      const match = await getMatchWithEmailAndKeyAccess(data.email, data.accessKey);
      if (!match) return;
      await signInAnonymouslyHandler();

    } catch (error) {
      if (import.meta.env.VITE_ENV === 'dev') console.log("Something went wrong:", error);
    }
  };
  
  return (
    <section className="bg-cover bg-center lg:bg-img-match-creation bg-img-match-confirmation-mobile h-screen w-screen overflow-y-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center px-2 lg:px-0">
        <Card className='min-h-[450px] py-2'>
          <div className="flex flex-col">
            <h1 className="mt-12 mb-5 font-semibold text-center text-2xl md:text-3xl lg:text-4xl select-none">
              Gérer mon match
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="lg:mt-0 mt-4 flex flex-col group space-y-2">
                <label
                  htmlFor="email"
                  className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D] select-none"
                >
                  EMAIL DE L'ORGANISATEUR :
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder='johndoe@gmail.com'
                  className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out  focus:drop-shadow-lg"
                />
                <span
                  className={`flex items-center font-medium text-red-500 text-xs mt-1 select-none ${
                    errors.email?.message ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {errors.email ? errors.email.message : "Champ requis"}
                </span>
              </div>
              <div className="lg:mt-0 mt-4 flex flex-col group space-y-2">
                <label
                  htmlFor="accessKey"
                  className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D] select-none"
                >
                  CODE D'ACCÈS :
                </label>
                <input
                  type="password"
                  placeholder='xxxxxxxxxx'
                  {...register("accessKey")}
                  className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out  focus:drop-shadow-lg"
                />
                <span
                  className={`flex items-center font-medium text-red-500 text-xs mt-1 select-none ${
                    errors.accessKey?.message ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {errors.accessKey ? errors.accessKey.message : "Champ requis"}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <SubmitButton isSubmitting={isSubmitting} buttonText='Accéder au match' className='mt-4 mb-5' />
              </div>
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default LoginManagementPage;