import React from "react";
import { WidgetConfigProvider,RemoteWidget } from '@tiktokshop/widget-kit-react';  
import axios from "axios";

const Warehouse = () => {

    const getWidgetToken = async () => {  
        const res = await axios.get('http://localhost:8000/widgettoken');  
        return res?.data?.data?.widget_token?.token || "";
      };  

    const initOptions = {  
        config: {  
          shopId: '7495756357774051569', //seller id, such as 123456  
          oecRegion: 'US', //country，such as US  
          appKey: '6ca7snomotd4q', //The key corresponding to the merchant's creation service  
          isvInfo: {  
            name: 'OPEN_PLATFORM', //ISV name，such as OPEN_PLATFORM  
          },  
        },  
        getToken: getWidgetToken, //get auth token  
        remotes: [  
          {  
            name: '@tiktokshop-widget/logistics:warehouse', //Integrated business name, provided by the open platform，such as：@tiktokshop-widget/logistics:warehouse  
          },  
        ],  
      };  

    return (
        <>
        <WidgetConfigProvider  
            config={initOptions.config}  
            getToken={initOptions.getToken}  
            remotes={initOptions.remotes}  
            preloadWidgetNames={['@tiktokshop-widget/logistics:warehouse']}>  
            <RemoteWidget  
                name={'@tiktokshop-widget/logistics:warehouse'}  
                className={'containerClass'}  
                options={{  
                    onResult: (data) => {  
                    if (data.code === 0) {  
                        //Callback function for successful warehouse submission  
                        console.log(data);
                    }  
                    },  
                    type: 'management',  
                }} //Pass in the props required by the widget. If there are none, you don’t need to pass them in.  
            />  
            </WidgetConfigProvider>  
        </>
    )
    
}

export default Warehouse;