export async function analyzeImage(file){

    return new Promise((resolve)=>{

        setTimeout(()=>{

            resolve({

                domain:"MRI",

                confidence:0.98,

                localization:true,

                classifier:"Glioma",

                bbox:[120,98,310,340]

            });

        },2000);

    });

}