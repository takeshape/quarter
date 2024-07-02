import { type LLMOutputComponent } from "@llm-ui/react";
import { Button, Card, CardFooter, Image } from "@nextui-org/react";
import productExample from "../../images/product-example.png";
import { ActionFunction as LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// TODO
const query = `
query ($id: ID!) {
  Shopify_product(id: $id) {
    title
    featuredImage {
      url
      altText
    }
  }
}
`;

type LoaderResponse = {
  success: boolean;
  product?: {
    title: string;
    featuredImage: {
      url: string;
      altText: string;
    }
  } | null;
  error?: string;
}

// export const loader: LoaderFunction = async ({request}) => {
//   const formData = await request.formData();

//   const takeshapeDomain = process.env.TAKESHAPE_DOMAIN;
//   if (!takeshapeDomain) {
//     throw new Error('TAKESHAPE_DOMAIN must be set');
//   }

//   const projectId = process.env.TAKESHAPE_PROJECT_ID;
//   if (!projectId) {
//     throw new Error('TAKESHAPE_PROJECT_ID must be set');
//   }

//   const apiKey = process.env.TAKESHAPE_API_KEY;
//   if (!apiKey) {
//     throw new Error('TAKESHAPE_API_KEY must be set');
//   }

//   const productId = formData.get('productId');

//   if (productId === null) {
//     return json({
//       success: true,
//       output: null
//     })
//   }

//   const response = await fetch(`https://${takeshapeDomain}/project/${projectId}/graphql`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${apiKey}`
//     },
//     body: JSON.stringify({
//       query,
//       variables: {
//         id: productId
//       }
//     })
//   });

//   if (response.status !== 200) {
//     console.error(response);
//     return json({success: false, error: `HTTP Status Code ${response.status}`});
//   }

//   const responseJson = await response.json();

//   if (responseJson.errors?.length > 0) {
//     console.error(response);
//     return json({success: false, error: responseJson.errors[0].message});
//   }

//   const result = { success: true, product: responseJson.data };

//   return json(result);
// };

export const Product: LLMOutputComponent = ({ blockMatch }) => {
  // const data = useLoaderData<LoaderResponse>();

  console.log('blockMatch', blockMatch);
  // console.log('data', data);

  return <Card isFooterBlurred className="w-ful h-64 my-4">
    <Image
      removeWrapper
      alt="Product Image"
      className="z-0 w-full h-full object-cover"
      src={productExample}
    />
    <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
      <div className="flex flex-grow gap-2">
        <div className="flex flex-col">
          <p className="text-white/90">{blockMatch.outputRaw}</p>
          <p className="text-white/60 !mb-0">Lorem ipsum something words.</p>
        </div>
      </div>
      <Button radius="full" size="sm">Add To Cart</Button>
    </CardFooter>
  </Card>
};
